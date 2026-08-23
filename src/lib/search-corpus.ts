import fs from "fs";
import path from "path";
import type { Locale } from "@/i18n/routing";
import { teamMembers } from "@/lib/data/team-members";
import {
  extractHeadings,
  slugToFilePath,
  truncateAtWordBoundary,
  stripMarkdownFormatting,
} from "@/lib/content-utils";
import {
  buildContentDocumentSlugs,
  getSupplementaryPageCopy,
  SUPPLEMENTARY_PAGE_SLUGS,
} from "@/lib/page-registry";
import { parseHierarchySlug } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import type { SearchDocument } from "@/lib/search-engine";

const MAX_SEARCH_BODY_LENGTH = 500;

function truncateSearchBody(text: string, maxLen = MAX_SEARCH_BODY_LENGTH): string {
  return truncateAtWordBoundary(text, maxLen, "...");
}

function getSearchDocumentType(
  slug: string,
): SearchDocument["type"] {
  return parseHierarchySlug(slug)?.kind ?? "content";
}

function buildSearchBreadcrumb(
  slug: string,
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const parsed = parseHierarchySlug(slug);
  if (!parsed) return "";

  const trail = [t.actionPlan, `${t.sphere} ${parsed.sphereId}`];
  if (parsed.kind !== "sphere") trail.push(`${t.goal} ${parsed.goalId}`);
  if (parsed.kind === "action") trail.push(`${t.action} ${parsed.actionId.replace("-", ".")}`);

  return trail.join(" › ");
}

export function buildContentSearchDocument(
  slug: string,
  locale: Locale,
  contentDir = path.join(process.cwd(), "content", locale),
): SearchDocument {
  const filePath = slugToFilePath(slug, contentDir);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { h1, h2 } = extractHeadings(raw);

    return {
      slug,
      type: getSearchDocumentType(slug),
      identifier: stripMarkdownFormatting(h1),
      title: stripMarkdownFormatting(h2),
      breadcrumb: buildSearchBreadcrumb(slug, locale),
      body: truncateSearchBody(stripMarkdownFormatting(raw)),
    };
  } catch (error) {
    throw new Error(
      `Failed to generate search corpus document for "${slug}" (locale: ${locale}, file: ${filePath}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function getExpectedSearchCorpusCount(): number {
  return (
    buildContentDocumentSlugs().length +
    SUPPLEMENTARY_PAGE_SLUGS.length +
    1 +
    teamMembers.length
  );
}

export function generateCorpus(locale: Locale): SearchDocument[] {
  const t = uiStrings[locale];
  const docs = buildContentDocumentSlugs().map((slug) =>
    buildContentSearchDocument(slug, locale),
  );

  for (const slug of SUPPLEMENTARY_PAGE_SLUGS) {
    const page = getSupplementaryPageCopy(slug, locale);
    docs.push({
      slug,
      type: "supplementary",
      identifier: page.identifier,
      title: page.title,
      breadcrumb: "",
      body: truncateSearchBody(page.description),
    });
  }

  docs.push({
    slug: "/",
    type: "content",
    identifier: `RESET: ${t.ogTagline}`,
    title: `RESET: ${t.ogTagline}`,
    breadcrumb: "",
    body: truncateSearchBody(`${t.heroContextP1} ${t.heroContextP2}`),
  });

  for (const member of teamMembers) {
    docs.push({
      slug: `/task-force/${member.slug}`,
      type: "member",
      identifier: member.name,
      title: member.name,
      breadcrumb: `${t.taskForceTitle} › ${member.role[locale]}`,
      body: truncateSearchBody(stripMarkdownFormatting(member.bio[locale].join(" "))),
    });
  }

  const expectedCount = getExpectedSearchCorpusCount();
  if (docs.length !== expectedCount) {
    throw new Error(
      `Search corpus count mismatch for locale "${locale}": expected ${expectedCount}, got ${docs.length}`,
    );
  }

  return docs;
}
