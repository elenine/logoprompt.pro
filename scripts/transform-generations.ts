import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

// Configuration
const GENERATIONS_DIR = path.join(process.cwd(), "generations");
const OUTPUT_DIR = path.join(process.cwd(), "src/data/logos");
const DRY_RUN = process.env.DRY_RUN === "true";

// Image optimization settings
const MAX_DIMENSION = 800; // Max width/height in pixels
const WEBP_QUALITY = 80; // WebP quality (0-100)

// Lazy import for UploadThing (only when needed)
let utapi: any = null;

async function getUploadThingApi() {
  if (!utapi && !DRY_RUN) {
    const { UTApi } = await import("uploadthing/server");
    utapi = new UTApi({
      token: process.env.UPLOADTHING_TOKEN,
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

interface LogoOutput {
  id: string;
  model: string;
  imageUrl: string;
  generatedAt: string;
}

interface Logo {
  id: string;
  prompt: string;
  createdAt: string;
  outputs: LogoOutput[];
}

interface LogoFile {
  id: string;
  name: string;
  createdAt: string;
  logos: Logo[];
}

interface LogosIndex {
  files: {
    id: string;
    name: string;
    path: string;
    createdAt: string;
    logoCount: number;
  }[];
  totalLogos: number;
  lastUpdated: string;
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
  // Extract timestamp from lumina-project-1766574339509
  const match = folderName.match(/lumina-project-(\d+)/);
  if (match) {
    const timestamp = parseInt(match[1]);
    const date = new Date(timestamp);
    return `Collection ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
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
      `     (${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB, -${savings}%)`
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
): Promise<LogoFile | null> {
  const folderName = path.basename(folderPath);
  const manifestPath = path.join(folderPath, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    console.log(`  No manifest.json found, skipping...`);
    return null;
  }

  const manifestContent = fs.readFileSync(manifestPath, "utf-8");
  const manifest: ManifestEntry[] = JSON.parse(manifestContent);

  const logos: Logo[] = [];
  let logoCounter = 1;

  // Get folder creation date from first entry
  const folderDate = manifest[0]?.iso_date?.split("T")[0] || new Date().toISOString().split("T")[0];

  for (const entry of manifest) {
    const outputs: LogoOutput[] = [];
    const logoId = `logo-${fileIndex}-${String(logoCounter).padStart(3, "0")}`;
    const createdAt = entry.iso_date.split("T")[0];

    // Process Gemini creations from manifest
    for (const creation of entry.creations) {
      const imagePath = path.join(folderPath, creation.image_path);

      if (fs.existsSync(imagePath)) {
        console.log(`    -> Gemini: ${creation.image_path}`);
        const imageUrl = await uploadFile(imagePath);

        if (imageUrl) {
          outputs.push({
            id: `${logoId}-gemini`,
            model: "gemini-2.5-flash",
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
              id: `${logoId}-gemini`,
              model: "gemini-2.5-flash",
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
          id: `${logoId}-ideogram${ideogramImages.length > 1 ? `-${i + 1}` : ""}`,
          model: "ideogram",
          imageUrl,
          generatedAt: entry.iso_date,
        });
      }
    }

    // Only add logo if it has at least one output
    if (outputs.length > 0) {
      logos.push({
        id: logoId,
        prompt: entry.prompt,
        createdAt,
        outputs,
      });
      logoCounter++;
    }
  }

  if (logos.length === 0) {
    return null;
  }

  return {
    id: `logo-${fileIndex}`,
    name: extractFolderName(folderName),
    createdAt: folderDate,
    logos,
  };
}

/**
 * Process all generation folders and create separate logo files
 */
async function transformGenerations(): Promise<void> {
  console.log("=".repeat(60));
  console.log("Logo Generations Transformer (Multi-File Mode)");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    console.log("\n[DRY RUN MODE] - No files will be uploaded");
    console.log("Run without DRY_RUN=true to upload files\n");
  } else {
    if (!process.env.UPLOADTHING_TOKEN) {
      console.error(
        "\nError: UPLOADTHING_TOKEN environment variable is required"
      );
      console.log("Set it with: export UPLOADTHING_TOKEN=your_token_here\n");
      process.exit(1);
    }
    console.log("\n[UPLOAD MODE] - Files will be uploaded to UploadThing");
    console.log(
      `[OPTIMIZATION] - Converting to WebP (max ${MAX_DIMENSION}px, quality ${WEBP_QUALITY}%)\n`
    );
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all generation folders sorted by name (which includes timestamp)
  const folders = fs
    .readdirSync(GENERATIONS_DIR)
    .filter((f) => f.startsWith("lumina-project-"))
    .sort()
    .map((f) => path.join(GENERATIONS_DIR, f));

  console.log(`Found ${folders.length} generation folders\n`);

  const indexEntries: LogosIndex["files"] = [];
  let totalLogos = 0;

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const fileIndex = i + 1;
    const folderName = path.basename(folder);

    console.log(`\n[${fileIndex}/${folders.length}] Processing ${folderName}`);

    const logoFile = await processFolder(folder, fileIndex);

    if (logoFile) {
      // Write individual logo file
      const outputPath = path.join(OUTPUT_DIR, `logo-${fileIndex}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(logoFile, null, 2));

      indexEntries.push({
        id: logoFile.id,
        name: logoFile.name,
        path: `logo-${fileIndex}.json`,
        createdAt: logoFile.createdAt,
        logoCount: logoFile.logos.length,
      });

      totalLogos += logoFile.logos.length;
      console.log(`  ✓ Created logo-${fileIndex}.json (${logoFile.logos.length} prompts)`);
    }
  }

  // Sort index by creation date (newest first)
  indexEntries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Write index file
  const indexData: LogosIndex = {
    files: indexEntries,
    totalLogos,
    lastUpdated: new Date().toISOString(),
  };

  const indexPath = path.join(OUTPUT_DIR, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("Transformation Complete!");
  console.log("=".repeat(60));
  console.log(`\nStatistics:`);
  console.log(`  Logo files created: ${indexEntries.length}`);
  console.log(`  Total prompts: ${totalLogos}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`Index file: ${indexPath}`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] No files were uploaded.");
    console.log("To upload files, run: pnpm run transform");
  }
}

// Run the transformation
transformGenerations().catch(console.error);
