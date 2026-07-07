/**
 * Build-time script: generates per-page sitemap lastmod dates from git
 * history (newest commit date across the three locale files of each page).
 * Run via: node --import tsx scripts/generate-content-dates.ts
 *
 * Outputs (gitignored, regenerated on every build):
 *   src/lib/data/content-dates.generated.json
 *     { taskForce: "YYYY-MM-DD", pages: { "<slug>": "YYYY-MM-DD" } }
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getManifest } from "../src/lib/content-manifest";
import { routing } from "../src/i18n/routing";

const LOCALES = routing.locales;
const OUT_PATH = path.join(process.cwd(), "src/lib/data/content-dates.generated.json");
const TEAM_MEMBERS_PATH = path.join(process.cwd(), "src/lib/data/team-members.ts");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function gitLastCommitDate(filePath: string): string | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", filePath], {
      encoding: "utf-8",
    }).trim();
    if (DATE_RE.test(out)) return out;
    // Tracked-but-never-committed or untracked file: treat as changed today.
    if (existsSync(filePath)) return new Date().toISOString().slice(0, 10);
    return undefined;
  } catch {
    return undefined;
  }
}

function newest(dates: (string | undefined)[]): string | undefined {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return undefined;
  return valid.sort().at(-1);
}

async function main(): Promise<void> {
  // filePath differs per locale; slug set is identical across locales.
  const manifests = await Promise.all(LOCALES.map((locale) => getManifest(locale)));

  const pages: Record<string, string> = {};
  const slugs = [...manifests[0].entries.keys()];
  for (const slug of slugs) {
    const date = newest(
      manifests.map((manifest) => {
        const filePath = manifest.entries.get(slug)?.filePath;
        return filePath ? gitLastCommitDate(filePath) : undefined;
      })
    );
    if (date) pages[slug] = date;
  }

  const taskForce = gitLastCommitDate(TEAM_MEMBERS_PATH);

  writeFileSync(OUT_PATH, JSON.stringify({ taskForce, pages }, null, 2) + "\n");
  console.log(
    `[content-dates] ${Object.keys(pages).length} page dates + taskForce=${taskForce} → ${path.relative(process.cwd(), OUT_PATH)}`
  );
}

main().catch((err: unknown) => {
  console.error("[content-dates] failed:", err);
  process.exit(1);
});
