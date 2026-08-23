import fs from "fs/promises";
import { localized } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import {
  assertValidLocale,
  getContentDir,
  extractHeadings,
  slugToFilePath,
} from "@/lib/content-utils";
import { parseHierarchySlug, shortHierarchyLabel } from "@/lib/path-utils";
import {
  GOAL_SUMMARIES,
  SPHERE_SUMMARIES,
} from "@/lib/data/navigation-labels";
import {
  buildContentDocumentSlugs,
  buildReadingOrder,
  getStaticContentPageTitle,
  getSupplementaryPageCopy,
  isStaticContentSlug,
  SUPPLEMENTARY_PAGE_SLUGS,
} from "@/lib/page-registry";

type ManifestEntry = {
  slug: string;
  filePath: string;
  identifier: string;
  title: string;
  pageTitle: string;
};

export type ContentManifest = {
  entries: Map<string, ManifestEntry>;
  readingOrder: string[];
};

function makeSidebarTitle(slug: string, h1: string, locale: Locale): string {
  const t = uiStrings[locale];
  const parsed = parseHierarchySlug(slug);

  if (parsed?.kind === "action") {
    return shortHierarchyLabel(slug, locale) ?? h1;
  }

  if (parsed?.kind === "goal") {
    return `${t.goal} ${parsed.goalId}: ${localized(GOAL_SUMMARIES[parsed.goalId], locale)}`;
  }

  if (parsed?.kind === "sphere") {
    return `${t.sphere} ${parsed.sphereId}: ${localized(SPHERE_SUMMARIES[parsed.sphereId], locale)}`;
  }

  return isStaticContentSlug(slug) ? getStaticContentPageTitle(slug, locale) : h1;
}

// Module-level cache because getManifest is reused across the full SSG build,
// while React.cache would only deduplicate repeated calls inside one render
// tree. Caching the promise (not the value) means concurrent callers during
// the build share one read instead of each re-reading all 109 files.
const manifestCache = new Map<Locale, Promise<ContentManifest>>();

export async function getManifest(locale: Locale): Promise<ContentManifest> {
  assertValidLocale(locale);

  const cached = manifestCache.get(locale);
  if (cached) return cached;

  const manifestPromise = buildManifestForLocale(locale);
  manifestCache.set(locale, manifestPromise);

  try {
    return await manifestPromise;
  } catch (error) {
    manifestCache.delete(locale);
    throw error;
  }
}

async function buildManifestForLocale(locale: Locale): Promise<ContentManifest> {
  const contentDir = getContentDir(locale);
  const readingOrder = buildReadingOrder();
  const entries = new Map<string, ManifestEntry>();
  const contentSlugs = buildContentDocumentSlugs();

  const results = await Promise.all(
    contentSlugs.map(async (slug) => {
      const filePath = slugToFilePath(slug, contentDir);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const { h1, h2 } = extractHeadings(content);
        return {
          slug,
          filePath,
          identifier: h1,
          title: h2,
          pageTitle: makeSidebarTitle(slug, h1, locale),
        } satisfies ManifestEntry;
      } catch (error) {
        throw new Error(
          `Failed to read content for "${slug}" (locale: ${locale}): ${error instanceof Error ? error.message : String(error)}`
        );
      }
    })
  );

  for (const entry of results) {
    entries.set(entry.slug, entry);
  }

  for (const slug of SUPPLEMENTARY_PAGE_SLUGS) {
    const page = getSupplementaryPageCopy(slug, locale);
    entries.set(slug, {
      slug,
      filePath: "",
      identifier: page.identifier,
      title: page.title,
      pageTitle: page.pageTitle,
    });
  }

  const t = uiStrings[locale];
  entries.set("/", {
    slug: "/",
    filePath: "",
    identifier: `RESET: ${t.ogTagline}`,
    title: `RESET: ${t.ogTagline}`,
    pageTitle: t.home,
  });

  return { entries, readingOrder };
}
