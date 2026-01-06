import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_LOGO = path.join(__dirname, '../public/logo.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const PUBLIC_DIR = path.join(__dirname, '../public');

const ICON_SIZES = {
  standard: [
    { size: 192, name: 'icon-192x192.png', outputDir: ICONS_DIR },
    { size: 512, name: 'icon-512x512.png', outputDir: ICONS_DIR },
    { size: 96, name: 'favicon-96x96.png', outputDir: ICONS_DIR }
  ],
  maskable: [
    { size: 192, name: 'icon-maskable-192x192.png', outputDir: ICONS_DIR, padding: true },
    { size: 512, name: 'icon-maskable-512x512.png', outputDir: ICONS_DIR, padding: true }
  ],
  apple: [
    { size: 180, name: 'apple-touch-icon.png', outputDir: PUBLIC_DIR },
    { size: 152, name: 'apple-touch-icon-152x152.png', outputDir: PUBLIC_DIR },
    { size: 120, name: 'apple-touch-icon-120x120.png', outputDir: PUBLIC_DIR }
  ]
};

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

async function generateIcon(config) {
  const { size, name, outputDir, padding } = config;
  const outputPath = path.join(outputDir, name);

  try {
    let pipeline = sharp(SOURCE_LOGO);

    if (padding) {
      // For maskable icons, add 20% padding (80% safe zone)
      const paddedSize = Math.round(size / 0.8);
      const paddingAmount = Math.round((paddedSize - size) / 2);

      pipeline = pipeline
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .extend({
          top: paddingAmount,
          bottom: paddingAmount,
          left: paddingAmount,
          right: paddingAmount,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        });
    } else {
      // Standard resize
      pipeline = pipeline.resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      });
    }

    await pipeline
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`✓ Generated: ${name} (${size}x${size}${padding ? ' maskable' : ''})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${name}:`, error.message);
    throw error;
  }
}

async function generateAllIcons() {
  console.log('🎨 Generating PWA icons from logo.png...\n');

  try {
    // Verify source logo exists
    await fs.access(SOURCE_LOGO);
    console.log(`✓ Source logo found: ${SOURCE_LOGO}\n`);

    // Ensure icons directory exists
    await ensureDirectoryExists(ICONS_DIR);

    // Generate all icon types
    console.log('Generating standard icons...');
    for (const config of ICON_SIZES.standard) {
      await generateIcon(config);
    }

    console.log('\nGenerating maskable icons...');
    for (const config of ICON_SIZES.maskable) {
      await generateIcon(config);
    }

    console.log('\nGenerating Apple touch icons...');
    for (const config of ICON_SIZES.apple) {
      await generateIcon(config);
    }

    console.log('\n✅ All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  📁 public/icons/');
    console.log('     - icon-192x192.png');
    console.log('     - icon-512x512.png');
    console.log('     - icon-maskable-192x192.png');
    console.log('     - icon-maskable-512x512.png');
    console.log('     - favicon-96x96.png');
    console.log('  📁 public/');
    console.log('     - apple-touch-icon.png (180x180)');
    console.log('     - apple-touch-icon-152x152.png');
    console.log('     - apple-touch-icon-120x120.png');
  } catch (error) {
    console.error('\n❌ Icon generation failed:', error.message);
    process.exit(1);
  }
}

// Run the generation
generateAllIcons();
