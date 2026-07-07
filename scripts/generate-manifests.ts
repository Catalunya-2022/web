/**
 * Build-time script: generates per-locale web app manifests from uiStrings.
 * Run via: node --import tsx scripts/generate-manifests.ts
 *
 * Outputs (gitignored, regenerated on every build):
 *   public/manifest-ca.webmanifest
 *   public/manifest-en.webmanifest
 *   public/manifest-es.webmanifest
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { routing } from "../src/i18n/routing";
import { buildManifest } from "../src/lib/metadata";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ICONS_DIR = path.join(PUBLIC_DIR, "icons");

// Fail loud if required PWA icons are missing
for (const icon of ["icon-192.png", "icon-512.png", "icon-512-maskable.png"]) {
  if (!existsSync(path.join(ICONS_DIR, icon))) {
    throw new Error(`[manifests] Missing icon: ${icon}. Run 'npm run generate:icons' first.`);
  }
}

mkdirSync(PUBLIC_DIR, { recursive: true });
for (const locale of routing.locales) {
  const manifest = buildManifest(locale);
  const outPath = path.join(PUBLIC_DIR, `manifest-${locale}.webmanifest`);
  writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`[manifests] ${locale} → ${path.relative(process.cwd(), outPath)}`);
}
