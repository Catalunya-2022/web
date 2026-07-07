/**
 * Build-time script: regenerates all app icons from src/app/icon.svg.
 * Run manually via: npm run generate:icons
 *
 * Outputs (committed to repo — not in prebuild):
 *   src/app/favicon.ico          (multi-size 16/32/48/64)
 *   public/icons/icon-16.png     (16×16)
 *   public/icons/icon-32.png     (32×32)
 *   public/icons/icon-48.png     (48×48)
 *   public/icons/icon-96.png     (96×96)
 *   public/apple-touch-icon.png  (180×180)
 *   public/icons/icon-192.png    (192×192)
 *   public/icons/icon-512.png    (512×512)
 *   public/icons/icon-512-maskable.png (512×512, full-bleed for Android adaptive launchers)
 */

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_SVG_PATH = path.join(ROOT, "src/app/icon.svg");
const APP_DIR = path.join(ROOT, "src/app");
const PUBLIC_DIR = path.join(ROOT, "public");
const ICONS_DIR = path.join(PUBLIC_DIR, "icons");

// The maskable icon needs full-bleed red background (no rounded corners)
// with the C scaled smaller to fit inside the 80% safe circle.
function buildMaskableSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#BF1523"/>
  <path d="M344 164a136 136 0 1 0 0 184" stroke="#fff" stroke-width="62" stroke-linecap="round" fill="none"/>
</svg>`;
}

type IconSpec = Readonly<{
  name: string;
  size: number;
  outPath: string;
  svg?: string; // override source SVG (for maskable variant)
}>;

const specs: readonly IconSpec[] = [
  { name: "icon-16", size: 16, outPath: path.join(ICONS_DIR, "icon-16.png") },
  { name: "icon-32", size: 32, outPath: path.join(ICONS_DIR, "icon-32.png") },
  { name: "icon-48", size: 48, outPath: path.join(ICONS_DIR, "icon-48.png") },
  { name: "icon-96", size: 96, outPath: path.join(ICONS_DIR, "icon-96.png") },
  { name: "apple-touch-icon", size: 180, outPath: path.join(PUBLIC_DIR, "apple-touch-icon.png") },
  { name: "icon-192", size: 192, outPath: path.join(ICONS_DIR, "icon-192.png") },
  { name: "icon-512", size: 512, outPath: path.join(ICONS_DIR, "icon-512.png") },
  { name: "icon-512-maskable", size: 512, outPath: path.join(ICONS_DIR, "icon-512-maskable.png"), svg: buildMaskableSvg() },
];

async function main(): Promise<void> {
  mkdirSync(ICONS_DIR, { recursive: true });
  const sourceSvg = readFileSync(SRC_SVG_PATH);

  // Generate PNGs
  for (const spec of specs) {
    const input = spec.svg ? Buffer.from(spec.svg) : sourceSvg;
    const info = await sharp(input, { density: 150 })
      .resize(spec.size, spec.size)
      .png({ compressionLevel: 9 })
      .toFile(spec.outPath);
    console.log(`[icons] ${spec.name} → ${path.relative(ROOT, spec.outPath)} (${info.size} bytes, ${info.width}×${info.height})`);
  }

  // Generate multi-size favicon.ico. The 64px layer exists because favicon
  // validators (and Windows high-DPI contexts) expect an entry above 48px;
  // png-to-ico stores BMP entries (size² × 4 bytes), so keep sizes modest.
  const icoSizes = [16, 32, 48, 64] as const;
  const icoBuffers: Buffer[] = [];
  for (const size of icoSizes) {
    icoBuffers.push(await sharp(sourceSvg, { density: 150 }).resize(size, size).png().toBuffer());
  }
  const icoBuffer: Buffer = await pngToIco(icoBuffers);
  const icoPath = path.join(APP_DIR, "favicon.ico");
  writeFileSync(icoPath, icoBuffer);
  console.log(`[icons] favicon.ico → ${path.relative(ROOT, icoPath)} (${icoBuffer.byteLength} bytes, ${icoSizes.join("/")}px)`);
}

main().catch((err: unknown) => {
  console.error("[icons] failed:", err);
  process.exit(1);
});
