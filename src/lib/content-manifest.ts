import fs from "fs/promises";
import { localized } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import {
  assertValidLocale,
  getContentDir,
  extractHeadings,
  slugToFilePath,
  truncateAtWordBoundary,
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

const SIDEBAR_GOAL_MAX_CHARS = 40;

function makeSidebarTitle(slug: string, h1: string, h2: string, locale: Locale): string {
  const t = uiStrings[locale];
  const parsed = parseHierarchySlug(slug);

  if (parsed?.kind === "action") {
    return shortHierarchyLabel(slug, locale) ?? h1;
  }

  if (parsed?.kind === "goal") {
    const goalNum = parsed.goalId;
    const summary = GOAL_SUMMARIES[goalNum];
    if (summary) {
      return `${t.goal} ${goalNum}: ${localized(summary, locale)}`;
    }
    const shortTitle = truncateAtWordBoundary(h2, SIDEBAR_GOAL_MAX_CHARS, "...");
    return `${t.goal} ${goalNum}: ${shortTitle}`;
  }

  if (parsed?.kind === "sphere") {
    const sphereId = parsed.sphereId;
    const summary = SPHERE_SUMMARIES[sphereId];
    if (summary) {
      return `${t.sphere} ${sphereId}: ${localized(summary, locale)}`;
    }
    return h2;
  }

  return isStaticContentSlug(slug) ? getStaticContentPageTitle(slug, locale) : h1;
}

// Module-level cache because getManifest is reused across the full SSG build,
// while React.cache would only deduplicate repeated calls inside one render tree.
const manifestCache = new Map<string, ContentManifest>();

export async function getManifest(locale: Locale = "ca"): Promise<ContentManifest> {
  assertValidLocale(locale);

  const cached = manifestCache.get(locale);
  if (cached) return cached;

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
          pageTitle: makeSidebarTitle(slug, h1, h2, locale),
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

  const manifest = { entries, readingOrder };
  manifestCache.set(locale, manifest);
  return manifest;
}
