/**
 * Regenerate public/documents/catalunya-2022-{ca,en,es}.md — the full-document
 * Markdown downloads — from content/{locale}/, the same sources the site
 * renders. Runs first in prebuild because generate-llms-files.ts copies these
 * files into llms-full.txt.
 *
 * Shape per section: `## H1` (identifier), the section's absolute URL, the
 * `### H2` subtitle, then the body with internal links resolved to absolute
 * localized URLs (external links pass through untouched).
 */

import fs from "fs/promises";
import path from "path";
import type { Locale } from "../src/i18n/routing";
import { routing } from "../src/i18n/routing";
import { DOCUMENT_TITLE } from "../src/lib/citation";
import { extractHeadings, getContentDir, slugToFilePath } from "../src/lib/content-utils";
import { buildAbsoluteUrl } from "../src/lib/metadata";
import { buildContentDocumentSlugs } from "../src/lib/page-registry";

function absolutifyInternalLinks(body: string, locale: Locale): string {
  return body.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, (_, label: string, slugPath: string) => {
    return `[${label}](${buildAbsoluteUrl(`/${slugPath}`, locale)})`;
  });
}

type LoadedSection = { h1: string; h2: string; body: string; url: string };

async function loadSection(slug: string, locale: Locale): Promise<LoadedSection> {
  const filePath = slugToFilePath(slug, getContentDir(locale));
  const raw = await fs.readFile(filePath, "utf-8");
  const { h1, h2, bodyStartIndex } = extractHeadings(raw);
  const body = absolutifyInternalLinks(
    raw.split("\n").slice(bodyStartIndex).join("\n").trim(),
    locale,
  );

  return { h1, h2, body, url: buildAbsoluteUrl(slug, locale) };
}

function renderDocumentSection(section: LoadedSection): string {
  return [`## ${section.h1}`, "", section.url, "", `### ${section.h2}`, "", section.body].join("\n");
}

/** Standalone page mirror at <page-url>.md — heading levels match the source MDX. */
function renderPageMarkdown(section: LoadedSection): string {
  return `${[`# ${section.h1}`, "", section.url, "", `## ${section.h2}`, "", section.body].join("\n")}\n`;
}

async function generateDocument(sections: LoadedSection[], locale: Locale): Promise<string> {
  const header = [`# ${DOCUMENT_TITLE[locale]}`, "", buildAbsoluteUrl("/", locale)].join("\n");

  return `${[header, ...sections.map(renderDocumentSection)].join("\n\n---\n\n")}\n`;
}

async function main(): Promise<void> {
  const publicDir = path.join(process.cwd(), "public");
  let pageCount = 0;

  for (const locale of routing.locales) {
    const slugs = buildContentDocumentSlugs();
    const sections = await Promise.all(slugs.map((slug) => loadSection(slug, locale)));

    const documentPath = path.join(publicDir, "documents", `catalunya-2022-${locale}.md`);
    await fs.writeFile(documentPath, await generateDocument(sections, locale), "utf-8");
    console.log(`✓ ${path.relative(process.cwd(), documentPath)}`);

    // Per-page markdown mirrors next to each content page (llms.txt v2:
    // <link rel="alternate" type="text/markdown"> targets). Localized paths,
    // e.g. /es/ambito-1/objetivo-2.md; served noindex via next.config headers.
    for (const section of sections) {
      const localizedPath = new URL(section.url).pathname;
      const pagePath = path.join(publicDir, `${localizedPath.slice(1)}.md`);
      await fs.mkdir(path.dirname(pagePath), { recursive: true });
      await fs.writeFile(pagePath, renderPageMarkdown(section), "utf-8");
      pageCount += 1;
    }
  }

  console.log(`✓ ${pageCount} per-page markdown mirrors`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
