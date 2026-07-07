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
import { uiStrings } from "@/lib/ui-strings";
import type { SearchDocument } from "@/lib/search-engine";

const MAX_SEARCH_BODY_LENGTH = 500;

function truncateSearchBody(text: string, maxLen = MAX_SEARCH_BODY_LENGTH): string {
  return truncateAtWordBoundary(text, maxLen, "...");
}

function getSearchDocumentType(
  slug: string,
): SearchDocument["type"] {
  const segments = slug.split("/").filter(Boolean);
  if (segments[2]?.startsWith("action-")) return "action";
  if (segments[1]?.startsWith("goal-")) return "goal";
  if (segments[0]?.startsWith("sphere-")) return "sphere";
  return "content";
}

function buildSearchBreadcrumb(
  slug: string,
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const segments = slug.split("/").filter(Boolean);

  const actionMatch = segments[2]?.match(/^action-(\d+-\d+)$/);
  if (actionMatch) {
    const sphereId = segments[0].replace("sphere-", "");
    const goalId = segments[1].replace("goal-", "");
    return `${t.actionPlan} > ${t.sphere} ${sphereId} > ${t.goal} ${goalId} > ${t.action} ${actionMatch[1].replace("-", ".")}`;
  }

  const goalMatch = segments[1]?.match(/^goal-(\d+)$/);
  if (goalMatch) {
    const sphereId = segments[0].replace("sphere-", "");
    return `${t.actionPlan} > ${t.sphere} ${sphereId} > ${t.goal} ${goalMatch[1]}`;
  }

  const sphereMatch = segments[0]?.match(/^sphere-(\d+)$/);
  if (sphereMatch) {
    return `${t.actionPlan} > ${t.sphere} ${sphereMatch[1]}`;
  }

  return "";
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
      identifier: h1,
      title: h2,
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
