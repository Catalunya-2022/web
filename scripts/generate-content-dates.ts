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
import { BASE_LAST_MOD } from "../src/lib/content-dates";
import { routing } from "../src/i18n/routing";

const LOCALES = routing.locales;
const OUT_PATH = path.join(process.cwd(), "src/lib/data/content-dates.generated.json");
const TEAM_MEMBERS_PATH = path.join(process.cwd(), "src/lib/data/team-members.ts");
const MEMBER_PAGE_PATH = path.join(process.cwd(), "src/app/[locale]/task-force/[member]/page.tsx");

// Non-MDX pages have no content file in the manifest; date them from their
// page component + primary data module so they stop falling back to
// BASE_LAST_MOD (which went stale whenever only these pages changed).
const APP = "src/app/[locale]";
const DATA = "src/lib/data";
const SUPPLEMENTARY_SOURCES: Record<string, string[]> = {
  "/": [`${APP}/page.tsx`, `${DATA}/hero-items.ts`],
  "/action-plan": [`${APP}/action-plan/page.tsx`, `${DATA}/constants.ts`],
  "/task-force": [`${APP}/task-force/page.tsx`, `${DATA}/team-members.ts`],
  "/organizations": [`${APP}/organizations/page.tsx`, `${DATA}/organizations.ts`],
  "/people-consulted": [`${APP}/people-consulted/page.tsx`, `${DATA}/people-consulted.ts`],
  "/press": [`${APP}/press/page.tsx`, `${DATA}/press-coverage.ts`],
  "/resources": [`${APP}/resources/page.tsx`, `${DATA}/resources.ts`],
  "/mcp": [`${APP}/mcp/page.tsx`, `${DATA}/mcp.ts`],
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Requiring package.json to be TRACKED (not merely inside some repo) means a
// tree unpacked within an unrelated git checkout is treated as no-git too,
// instead of dating every page "today" via the existsSync branch below.
function isGitCheckout(): boolean {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", "package.json"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

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
  const slugs = [...manifests[0].entries.keys()];

  // A checkout without usable git history (ZIP download, degit, tarball)
  // still has to build: stamp everything with the site-wide floor, which is
  // what the runtime would floor these dates to anyway.
  if (!isGitCheckout()) {
    const pages = Object.fromEntries(slugs.map((slug) => [slug, BASE_LAST_MOD]));
    writeFileSync(OUT_PATH, JSON.stringify({ taskForce: BASE_LAST_MOD, pages }, null, 2) + "\n");
    console.warn(
      `[content-dates] no git checkout detected; using BASE_LAST_MOD (${BASE_LAST_MOD}) for all ${slugs.length} pages`
    );
    return;
  }

  const pages: Record<string, string> = {};
  for (const slug of slugs) {
    const supplementarySources = SUPPLEMENTARY_SOURCES[slug];
    const date = supplementarySources
      ? newest(supplementarySources.map(gitLastCommitDate))
      : newest(
          manifests.map((manifest) => {
            const filePath = manifest.entries.get(slug)?.filePath;
            return filePath ? gitLastCommitDate(filePath) : undefined;
          })
        );
    if (date) pages[slug] = date;
  }

  const taskForce = newest([
    gitLastCommitDate(TEAM_MEMBERS_PATH),
    gitLastCommitDate(MEMBER_PAGE_PATH),
  ]);

  // Every git lookup failing silently would ship 441 frozen lastmods; a
  // build from a real checkout must always produce dates.
  if (Object.keys(pages).length === 0 || !taskForce) {
    throw new Error(
      "no git dates resolved (is this a git checkout?); refusing to write an empty content-dates file"
    );
  }

  writeFileSync(OUT_PATH, JSON.stringify({ taskForce, pages }, null, 2) + "\n");
  console.log(
    `[content-dates] ${Object.keys(pages).length} page dates + taskForce=${taskForce} → ${path.relative(process.cwd(), OUT_PATH)}`
  );
}

main().catch((err: unknown) => {
  console.error("[content-dates] failed:", err);
  process.exit(1);
});
