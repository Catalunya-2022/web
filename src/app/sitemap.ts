import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getManifest } from "@/lib/content-manifest";
import { teamMembers } from "@/lib/data/team-members";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

const LOCALES = routing.locales;
/** Date of the last site-wide change (layout/metadata alter every rendered
 *  page). Bump manually on the next one; newer per-page git dates win. */
const BASE_LAST_MOD = "2026-07-05";

function flooredDate(gitDate?: string): string {
  // ISO date strings compare lexically.
  return gitDate && gitDate > BASE_LAST_MOD ? gitDate : BASE_LAST_MOD;
}

type ContentDates = { taskForce?: string; pages?: Record<string, string> };

// Written by scripts/generate-content-dates.ts during prebuild.
function loadContentDates(): ContentDates {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "src/lib/data/content-dates.generated.json"),
      "utf-8"
    );
    return JSON.parse(raw) as ContentDates;
  } catch {
    return {};
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getManifest("en");
  const contentDates = loadContentDates();
  const entries: MetadataRoute.Sitemap = [];

  for (const slug of manifest.readingOrder) {
    for (const locale of LOCALES) {
      entries.push({
        url: buildAbsoluteUrl(slug, locale),
        lastModified: flooredDate(contentDates.pages?.[slug]),
        alternates: {
          languages: {
            ca: buildAbsoluteUrl(slug, "ca"),
            en: buildAbsoluteUrl(slug, "en"),
            es: buildAbsoluteUrl(slug, "es"),
            "x-default": buildAbsoluteUrl(slug, "ca"),
          },
        },
      });
    }
  }

  for (const member of teamMembers) {
    const slug = `/task-force/${member.slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: buildAbsoluteUrl(slug, locale),
        lastModified: flooredDate(contentDates.taskForce),
        alternates: {
          languages: {
            ca: buildAbsoluteUrl(slug, "ca"),
            en: buildAbsoluteUrl(slug, "en"),
            es: buildAbsoluteUrl(slug, "es"),
            "x-default": buildAbsoluteUrl(slug, "ca"),
          },
        },
      });
    }
  }

  return entries;
}
