/**
 * Build-time script: generates per-locale search corpus JSON files.
 * Run via: tsx scripts/generate-search-corpus.ts
 *
 * Reads MDX content files + team members data, outputs:
 *   public/search-corpus-ca.json
 *   public/search-corpus-en.json
 *   public/search-corpus-es.json
 */

import fs from "fs";
import path from "path";
import { routing } from "../src/i18n/routing";
import { generateCorpus } from "../src/lib/search-corpus";

const LOCALES = routing.locales;
const publicDir = path.join(process.cwd(), "public");

for (const locale of LOCALES) {
  const corpus = generateCorpus(locale);
  const outPath = path.join(publicDir, `search-corpus-${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(corpus));
  console.log(`[search-corpus] ${locale}: ${corpus.length} documents → ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)}KB)`);
}
