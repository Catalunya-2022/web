/**
 * Manual script: submits every site URL to IndexNow (Bing/Yandex/Naver;
 * Google does not consume it). Run after deploys that changed content:
 *   npm run indexnow                (submit)
 *   npm run indexnow -- --dry-run   (preview only)
 *
 * The key served at https://2022.cat/<key>.txt is the ownership proof, not
 * a secret. Rotate with `openssl rand -hex 32` and replace public/<key>.txt;
 * the script finds the key file by filename pattern.
 *
 * Responses: 200/202 = accepted; 403 on a brand-new key until IndexNow
 * verifies it (retry later); 422 = URL/host mismatch; 429 = retry later.
 * Protocol reference: https://www.indexnow.org/documentation
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import { getManifest } from "../src/lib/content-manifest";
import { teamMembers } from "../src/lib/data/team-members";
import { buildAbsoluteUrl, BASE_URL } from "../src/lib/metadata";
import { routing } from "../src/i18n/routing";

const LOCALES = routing.locales;
const HOST = new URL(BASE_URL).host;
const KEY_FILE_RE = /^[0-9a-f]{64}\.txt$/;

function findKey(): string {
  const publicDir = path.join(process.cwd(), "public");
  const keyFiles = readdirSync(publicDir).filter((f) => KEY_FILE_RE.test(f));
  if (keyFiles.length !== 1) {
    throw new Error(
      `[indexnow] Expected exactly one 64-hex-char .txt key file in public/, found ${keyFiles.length}. See this script's header comment.`
    );
  }
  return keyFiles[0].replace(/\.txt$/, "");
}

async function collectUrls(): Promise<string[]> {
  const manifest = await getManifest("en");
  const urls: string[] = [];
  for (const slug of manifest.readingOrder) {
    for (const locale of LOCALES) {
      urls.push(buildAbsoluteUrl(slug, locale));
    }
  }
  for (const member of teamMembers) {
    for (const locale of LOCALES) {
      urls.push(buildAbsoluteUrl(`/task-force/${member.slug}`, locale));
    }
  }
  return urls;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const key = findKey();
  const urlList = await collectUrls();

  console.log(`[indexnow] host=${HOST} urls=${urlList.length} key=${key.slice(0, 8)}…`);

  if (dryRun) {
    console.log("[indexnow] dry run - first 5 URLs:");
    for (const url of urlList.slice(0, 5)) console.log(`  ${url}`);
    return;
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList,
    }),
  });

  console.log(`[indexnow] response: ${response.status} ${response.statusText}`);
  if (response.status !== 200 && response.status !== 202) {
    const body = await response.text();
    throw new Error(`[indexnow] submission failed: ${body || "(empty body)"}`);
  }
  console.log(`[indexnow] submitted ${urlList.length} URLs successfully`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
