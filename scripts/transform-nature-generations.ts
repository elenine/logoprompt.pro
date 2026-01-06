import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

// Configuration
const GENERATIONS_DIR = path.join(process.cwd(), "nature-generations");
const OUTPUT_DIR = path.join(process.cwd(), "src/data/natures");
const DRY_RUN = process.env.DRY_RUN === "true";

// UploadThing API Token
const UPLOADTHING_TOKEN =
  "eyJhcGlLZXkiOiJza19saXZlXzkwOTA3ZDkxOTRmYWE0OTMzNDNjODljMDlkYzMyNmUyN2FiODBmNGExNjdkM2FiMzBlZjEzNjU0YTFiOGY1ZjYiLCJhcHBJZCI6ImRkdTJ5YzJ4a3giLCJyZWdpb25zIjpbInNlYTEiXX0=";

// Image optimization settings
const MAX_DIMENSION = 800; // Max width/height in pixels
const WEBP_QUALITY = 100; // WebP quality (0-100)

// Lazy import for UploadThing (only when needed)
let utapi: any = null;

async function getUploadThingApi() {
  if (!utapi && !DRY_RUN) {
    const { UTApi } = await import("uploadthing/server");
    utapi = new UTApi({
      token: UPLOADTHING_TOKEN,
    });
  }
  return utapi;
}

interface ManifestCreation {
  image_path: string;
  model_name: string;
}

interface ManifestEntry {
  prompt: string;
  aspect_ratio: string;
  timestamp: number;
  iso_date: string;
  creations: ManifestCreation[];
}

interface NatureOutput {
  id: string;
  model: string;
  imageUrl: string;
  generatedAt: string;
}

interface Nature {
  id: string;
  prompt: string;
  createdAt: string;
  outputs: NatureOutput[];
}

interface NatureFile {
  id: string;
  name: string;
  createdAt: string;
  natures: Nature[];
}

interface NaturesIndex {
  files: {
    id: string;
    name: string;
    path: string;
    createdAt: string;
    natureCount: number;
  }[];
  totalNatures: number;
  lastUpdated: string;
}

/**
 * Get the next available nature index by reading existing index.json
 */
function getNextNatureIndex(): number {
  const indexPath = path.join(OUTPUT_DIR, "index.json");

  if (!fs.existsSync(indexPath)) {
    return 1;
  }

  try {
    const indexContent = fs.readFileSync(indexPath, "utf-8");
    const indexData: NaturesIndex = JSON.parse(indexContent);

    if (indexData.files.length === 0) {
      return 1;
    }

    // Find the highest nature number from existing files
    const maxIndex = indexData.files.reduce((max, file) => {
      const match = file.path.match(/nature-(\d+)\.json/);
      if (match) {
        return Math.max(max, parseInt(match[1]));
      }
      return max;
    }, 0);

    return maxIndex + 1;
  } catch (error) {
    console.error("Error reading existing index.json:", error);
    return 1;
  }
}

/**
 * Load existing index entries from index.json
 */
function loadExistingIndex(): NaturesIndex {
  const indexPath = path.join(OUTPUT_DIR, "index.json");

  if (!fs.existsSync(indexPath)) {
    return {
      files: [],
      totalNatures: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const indexContent = fs.readFileSync(indexPath, "utf-8");
    return JSON.parse(indexContent);
  } catch (error) {
    console.error("Error loading existing index.json:", error);
    return {
      files: [],
      totalNatures: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Remove a processed folder from generations directory
 */
function removeProcessedFolder(folderPath: string): void {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would remove: ${path.basename(folderPath)}`);
    return;
  }

  try {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`  Removed: ${path.basename(folderPath)}`);
  } catch (error) {
    console.error(`  Failed to remove ${path.basename(folderPath)}:`, error);
  }
}

/**
 * Slugify text to match Ideogram filename pattern
 */
function slugifyPrompt(prompt: string, maxLength = 40): string {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .substring(0, maxLength)
    .replace(/-+$/, ""); // Remove trailing hyphens
}

/**
 * Extract a readable name from folder name
 */
function extractFolderName(folderName: string): string {
  // Extract timestamp from lumina-project-{timestamp}
  const match = folderName.match(/lumina-project-(\d+)/);
  if (match) {
    const timestamp = parseInt(match[1]);
    const date = new Date(timestamp);
    return `Nature ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }
  return folderName;
}

/**
 * Find Ideogram images that match a prompt in a folder
 */
function findIdeogramImages(
  folderPath: string,
  prompt: string
): { path: string; filename: string }[] {
  const matches: { path: string; filename: string }[] = [];
  const slugPrefix = slugifyPrompt(prompt);

  // Check root folder for ideogram images (jpeg files with prompt-based names)
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (file.endsWith(".jpeg") || file.endsWith(".jpg")) {
      const fileSlug = file.split("_")[0]; // Get the prompt part before the IDs
      if (fileSlug.startsWith(slugPrefix.substring(0, 20))) {
        matches.push({
          path: path.join(folderPath, file),
          filename: file,
        });
      }
    }
  }

  // Also check ideogram subfolder if it exists
  const ideogramPath = path.join(folderPath, "ideogram");
  if (fs.existsSync(ideogramPath)) {
    const ideogramFiles = fs.readdirSync(ideogramPath);
    for (const file of ideogramFiles) {
      if (file.endsWith(".jpeg") || file.endsWith(".jpg")) {
        const fileSlug = file.split("_")[0];
        if (fileSlug.startsWith(slugPrefix.substring(0, 20))) {
          matches.push({
            path: path.join(ideogramPath, file),
            filename: file,
          });
        }
      }
    }
  }

  return matches;
}

/**
 * Optimize image: resize to max dimension and convert to WebP
 */
async function optimizeImage(
  filePath: string
): Promise<{
  buffer: Buffer;
  filename: string;
  originalSize: number;
  optimizedSize: number;
}> {
  const originalBuffer = fs.readFileSync(filePath);
  const originalSize = originalBuffer.length;
  const originalFilename = path.basename(filePath);
  const webpFilename = originalFilename.replace(/\.(png|jpe?g)$/i, ".webp");

  const optimizedBuffer = await sharp(originalBuffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    filename: webpFilename,
    originalSize,
    optimizedSize: optimizedBuffer.length,
  };
}

/**
 * Upload a file to UploadThing (or return placeholder in dry-run mode)
 */
async function uploadFile(filePath: string): Promise<string | null> {
  const originalFilename = path.basename(filePath);

  // In dry-run mode, return a placeholder URL
  if (DRY_RUN) {
    return `[LOCAL:${filePath}]`;
  }

  try {
    const api = await getUploadThingApi();
    if (!api) {
      console.error("UploadThing API not initialized");
      return null;
    }

    // Optimize the image
    const { buffer, filename, originalSize, optimizedSize } =
      await optimizeImage(filePath);
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    console.log(
      `     (${(originalSize / 1024).toFixed(0)}KB -> ${(optimizedSize / 1024).toFixed(0)}KB, -${savings}%)`
    );

    const blob = new Blob([buffer]);
    const file = new File([blob], filename, {
      type: "image/webp",
    });

    const response = await api.uploadFiles([file]);

    if (response[0]?.data?.ufsUrl) {
      return response[0].data.ufsUrl;
    }
    if (response[0]?.data?.url) {
      return response[0].data.url;
    }
    console.error(`Upload failed for ${originalFilename}:`, response[0]?.error);
    return null;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
}

/**
 * Process a single generation folder
 */
async function processFolder(
  folderPath: string,
  fileIndex: number
): Promise<NatureFile | null> {
  const folderName = path.basename(folderPath);
  const manifestPath = path.join(folderPath, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    console.log(`  No manifest.json found, skipping...`);
    return null;
  }

  const manifestContent = fs.readFileSync(manifestPath, "utf-8");
  const manifest: ManifestEntry[] = JSON.parse(manifestContent);

  const natures: Nature[] = [];
  let natureCounter = 1;

  // Get folder creation date from first entry
  const folderDate = manifest[0]?.iso_date?.split("T")[0] || new Date().toISOString().split("T")[0];

  for (const entry of manifest) {
    const outputs: NatureOutput[] = [];
    const natureId = `nature-${fileIndex}-${String(natureCounter).padStart(3, "0")}`;
    const createdAt = entry.iso_date.split("T")[0];

    // Process Gemini creations from manifest
    for (const creation of entry.creations) {
      const imagePath = path.join(folderPath, creation.image_path);

      if (fs.existsSync(imagePath)) {
        console.log(`    -> Gemini: ${creation.image_path}`);
        const imageUrl = await uploadFile(imagePath);

        if (imageUrl) {
          outputs.push({
            id: `${natureId}-gemini`,
            model: "Gemini nano banana",
            imageUrl,
            generatedAt: entry.iso_date,
          });
        }
      } else {
        // Try without 'images/' prefix (for older folder structure)
        const altPath = path.join(folderPath, path.basename(creation.image_path));
        if (fs.existsSync(altPath)) {
          console.log(`    -> Gemini: ${path.basename(altPath)}`);
          const imageUrl = await uploadFile(altPath);

          if (imageUrl) {
            outputs.push({
              id: `${natureId}-gemini`,
              model: "Gemini nano banana",
              imageUrl,
              generatedAt: entry.iso_date,
            });
          }
        }
      }
    }

    // Find and process matching Ideogram images
    const ideogramImages = findIdeogramImages(folderPath, entry.prompt);

    for (let i = 0; i < ideogramImages.length; i++) {
      const ideogramImage = ideogramImages[i];
      console.log(`    -> Ideogram: ${ideogramImage.filename}`);
      const imageUrl = await uploadFile(ideogramImage.path);

      if (imageUrl) {
        outputs.push({
          id: `${natureId}-ideogram${ideogramImages.length > 1 ? `-${i + 1}` : ""}`,
          model: "ideogram",
          imageUrl,
          generatedAt: entry.iso_date,
        });
      }
    }

    // Only add nature if it has at least one output
    if (outputs.length > 0) {
      natures.push({
        id: natureId,
        prompt: entry.prompt,
        createdAt,
        outputs,
      });
      natureCounter++;
    }
  }

  if (natures.length === 0) {
    return null;
  }

  return {
    id: `nature-${fileIndex}`,
    name: extractFolderName(folderName),
    createdAt: folderDate,
    natures,
  };
}

/**
 * Process all generation folders and create separate nature files
 */
async function transformGenerations(): Promise<void> {
  console.log("=".repeat(60));
  console.log("Nature Generations Transformer (Append Mode)");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    console.log("\n[DRY RUN MODE] - No files will be uploaded or deleted");
    console.log("Run without DRY_RUN=true to upload files\n");
  } else {
    console.log("\n[UPLOAD MODE] - Files will be uploaded to UploadThing");
    console.log(
      `[OPTIMIZATION] - Converting to WebP (max ${MAX_DIMENSION}px, quality ${WEBP_QUALITY}%)\n`
    );
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load existing index to preserve entries and get next available index
  const existingIndex = loadExistingIndex();
  const startIndex = getNextNatureIndex();

  console.log(`Existing natures: ${existingIndex.files.length} files, ${existingIndex.totalNatures} prompts`);
  console.log(`Next nature index: ${startIndex}`);

  // Get all generation folders sorted by name (which includes timestamp)
  const folders = fs
    .readdirSync(GENERATIONS_DIR)
    .filter((f) => f.startsWith("lumina-project-"))
    .sort()
    .map((f) => path.join(GENERATIONS_DIR, f));

  if (folders.length === 0) {
    console.log("\nNo new generation folders to process.");
    return;
  }

  console.log(`\nFound ${folders.length} new generation folders to process\n`);

  const newIndexEntries: NaturesIndex["files"] = [];
  let newNaturesCount = 0;
  let foldersCleanedUp = 0;
  const indexPath = path.join(OUTPUT_DIR, "index.json");

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const fileIndex = startIndex + i;
    const folderName = path.basename(folder);

    console.log(`\n[${i + 1}/${folders.length}] Processing ${folderName}`);

    const natureFile = await processFolder(folder, fileIndex);

    if (natureFile) {
      // Write individual nature file
      const outputPath = path.join(OUTPUT_DIR, `nature-${fileIndex}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(natureFile, null, 2));

      const newEntry = {
        id: natureFile.id,
        name: natureFile.name,
        path: `nature-${fileIndex}.json`,
        createdAt: natureFile.createdAt,
        natureCount: natureFile.natures.length,
      };

      newIndexEntries.push(newEntry);
      newNaturesCount += natureFile.natures.length;

      // Update index.json immediately after each successful folder
      const allIndexEntries = [...existingIndex.files, ...newIndexEntries];
      allIndexEntries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const indexData: NaturesIndex = {
        files: allIndexEntries,
        totalNatures: existingIndex.totalNatures + newNaturesCount,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

      console.log(`  Created nature-${fileIndex}.json (${natureFile.natures.length} prompts)`);

      // Remove folder immediately after successful processing
      removeProcessedFolder(folder);
      foldersCleanedUp++;
    }
  }

  // Final totals
  const totalNatures = existingIndex.totalNatures + newNaturesCount;
  const totalFiles = existingIndex.files.length + newIndexEntries.length;

  console.log("\n" + "=".repeat(60));
  console.log("Transformation Complete!");
  console.log("=".repeat(60));
  console.log(`\nStatistics:`);
  console.log(`  New nature files created: ${newIndexEntries.length}`);
  console.log(`  New prompts added: ${newNaturesCount}`);
  console.log(`  Total nature files: ${totalFiles}`);
  console.log(`  Total prompts: ${totalNatures}`);
  console.log(`  Folders cleaned up: ${foldersCleanedUp}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`Index file: ${indexPath}`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] No files were uploaded or deleted.");
    console.log("To run for real, run: pnpm run transform:natures");
  }
}

// Run the transformation
transformGenerations().catch(console.error);
