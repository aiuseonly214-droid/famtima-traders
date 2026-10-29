import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");
const imagesDir = path.resolve(publicDir, "images");

async function run() {
  console.log("Optimizing images in:", publicDir);

  // 1. Logo: famtima-logo.png
  // Rendered at 42x42px (and up to 80px on high-DPI / modals / print).
  // We'll generate a crisp 160x160 webp, and a compressed 160x160 png fallback.
  const logoPath = path.join(publicDir, "famtima-logo.png");
  const logoWebpPath = path.join(publicDir, "famtima-logo.webp");

  if (fs.existsSync(logoPath)) {
    const origLogoStat = fs.statSync(logoPath);
    console.log(`Original logo size: ${(origLogoStat.size / 1024 / 1024).toFixed(2)} MB`);

    // Create webp version
    await sharp(logoPath)
      .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, effort: 6 })
      .toFile(logoWebpPath);

    const webpStat = fs.statSync(logoWebpPath);
    console.log(`Optimized WebP logo size: ${(webpStat.size / 1024).toFixed(2)} KB`);

    // Also overwrite or optimize PNG to be small just in case any client loads png
    const logoPngOptimized = path.join(publicDir, "famtima-logo-optimized.png");
    await sharp(logoPath)
      .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90, compressionLevel: 9, effort: 7 })
      .toFile(logoPngOptimized);
    fs.renameSync(logoPngOptimized, logoPath);
    const newPngStat = fs.statSync(logoPath);
    console.log(`Optimized PNG logo size: ${(newPngStat.size / 1024).toFixed(2)} KB`);
  }

  // 2. Portfolio images in imagesDir
  const images = [
    "pop-ceiling-nashik.jpg",
    "modern-kitchen-ceiling-nashik.jpg",
    "bedroom-gypsum-ceiling-nashik.jpg",
    "pvc-wall-panels-nashik.jpg",
  ];

  for (const imgName of images) {
    const srcPath = path.join(imagesDir, imgName);
    if (!fs.existsSync(srcPath)) {
      console.log(`Not found: ${srcPath}`);
      continue;
    }
    const stat = fs.statSync(srcPath);
    console.log(`\nProcessing ${imgName} (${(stat.size / 1024).toFixed(2)} KB)...`);

    const baseName = imgName.replace(/\.jpg$/, "");
    const webpPath = path.join(imagesDir, `${baseName}.webp`);

    // For hero & gallery, display size is max ~800px on desktop, ~400px on mobile.
    // We'll resize max width to 1200px (2x for retina), quality 82 webp.
    await sharp(srcPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath);

    const webpStat = fs.statSync(webpPath);
    console.log(`Generated ${baseName}.webp: ${(webpStat.size / 1024).toFixed(2)} KB`);

    // Also generate a responsive 600px width webp for mobile
    const webpSmallPath = path.join(imagesDir, `${baseName}-sm.webp`);
    await sharp(srcPath)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(webpSmallPath);
    const webpSmallStat = fs.statSync(webpSmallPath);
    console.log(`Generated ${baseName}-sm.webp: ${(webpSmallStat.size / 1024).toFixed(2)} KB`);

    // Also compress the fallback JPG to reasonable size (<100KB)
    const jpgOptimized = path.join(imagesDir, `${baseName}-opt.jpg`);
    await sharp(srcPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(jpgOptimized);
    fs.renameSync(jpgOptimized, srcPath);
    const newJpgStat = fs.statSync(srcPath);
    console.log(`Optimized ${imgName}: ${(newJpgStat.size / 1024).toFixed(2)} KB`);
  }

  console.log("\nAll images processed successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
