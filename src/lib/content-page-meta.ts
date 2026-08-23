import {
  stripMarkdownFormatting,
  truncateAtSentenceBoundary,
  truncateAtWordBoundary,
} from "@/lib/content-utils";

type ContentPageMetaSource = {
  identifier: string;
  subtitle: string | null;
  body: string;
};

/** Max chars for meta description. Google shows ~155 chars on desktop, ~120 on mobile. */
const MAX_META_DESCRIPTION_LENGTH = 155;

/** Only transforms ALL-CAPS identifiers (e.g. "ACTION 1.1" → "Action 1.1").
 *  Mixed-case input (e.g. "Acció 1.1") passes through unchanged. */
export function titleCaseIdentifier(id: string): string {
  if (id !== id.toUpperCase()) return id;
  return id
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function firstParagraph(markdown: string): string | null {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .map((chunk) => stripMarkdownFormatting(chunk))
    .find(Boolean);

  return paragraph ?? null;
}

/** Meta title ("Identifier: Subtitle", untruncated) and description (first body
 *  paragraph, cut at a sentence boundary) for article content pages. */
export function getContentPageMetadata(content: ContentPageMetaSource): {
  title: string;
  description: string | undefined;
} {
  const subtitle =
    content.subtitle === null ? null : stripMarkdownFormatting(content.subtitle);
  const id = titleCaseIdentifier(content.identifier);
  const title = subtitle ? `${id}: ${subtitle}` : id;

  const paragraph = firstParagraph(content.body);
  const description = paragraph
    ? (truncateAtSentenceBoundary(paragraph, MAX_META_DESCRIPTION_LENGTH) ??
      truncateAtWordBoundary(paragraph, MAX_META_DESCRIPTION_LENGTH))
    : undefined;

  return {
    title,
    description,
  };
}
