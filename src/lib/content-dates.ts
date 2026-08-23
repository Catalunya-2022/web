import fs from "node:fs";
import path from "node:path";

/** Date of the last site-wide change (layout/metadata alter every rendered
 *  page). Bump manually on the next one; newer per-page git dates win. */
export const BASE_LAST_MOD = "2026-08-18";

type ContentDates = { taskForce?: string; pages?: Record<string, string> };

let cache: ContentDates | undefined;

// Written by scripts/generate-content-dates.ts during prebuild.
function loadContentDates(): ContentDates {
  if (!cache) {
    try {
      const raw = fs.readFileSync(
        path.join(process.cwd(), "src/lib/data/content-dates.generated.json"),
        "utf-8"
      );
      cache = JSON.parse(raw) as ContentDates;
    } catch {
      // Prebuild writes this file; falling back to BASE_LAST_MOD alone is
      // valid for tests but wrong for production builds, so say so loudly.
      console.warn(
        "[content-dates] content-dates.generated.json missing or invalid; all pages fall back to BASE_LAST_MOD"
      );
      cache = {};
    }
  }
  return cache;
}

function floored(gitDate?: string): string {
  // ISO date strings compare lexically.
  return gitDate && gitDate > BASE_LAST_MOD ? gitDate : BASE_LAST_MOD;
}

export function getContentLastModified(slug: string): string {
  return floored(loadContentDates().pages?.[slug]);
}

export function getTaskForceLastModified(): string {
  return floored(loadContentDates().taskForce);
}
