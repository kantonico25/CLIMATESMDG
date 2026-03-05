import fs from "fs";
import path from "path";
import sharp from "sharp";

const outputDir = path.resolve("src/assets/generated");
fs.mkdirSync(outputDir, { recursive: true });

const images = [
  { src: "src/assets/images/hero.webp", name: "hero", widths: [1200, 1800] },
  { src: "src/assets/images/image (1).webp", name: "about", widths: [600, 900, 1200] },
  { src: "src/assets/images/image (2).webp", name: "gallery-1", widths: [600, 900, 1200] },
  { src: "src/assets/images/image (3).webp", name: "gallery-2", widths: [600, 900, 1200] },
  { src: "src/assets/images/image (4).webp", name: "gallery-3", widths: [600, 900, 1200] },
  { src: "src/assets/images/image (5).webp", name: "gallery-4", widths: [600, 900, 1200] },
  { src: "src/assets/images/image 6.webp", name: "gallery-5", widths: [600, 900, 1200] },
];

const generateVariants = async (entry) => {
  const { src, name, widths } = entry;

  for (const width of widths) {
    const base = path.join(outputDir, `${name}-${width}`);

    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(`${base}.avif`);

    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(`${base}.webp`);
  }
};

const run = async () => {
  for (const entry of images) {
    await generateVariants(entry);
  }
  console.log("Image optimization complete.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
