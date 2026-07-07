import { stripMarkdownFormatting, truncateAtWordBoundary } from "@/lib/content-utils";

type ContentPageMetaSource = {
  identifier: string;
  subtitle: string | null;
  body: string;
};

export type ContentPageMetaOptions = {
  title?: "identifier" | "subtitle-or-identifier" | "identifier-with-subtitle";
  description?: "subtitle" | "first-paragraph";
  /** Override the default 60-char title truncation limit. Use Infinity for no truncation. */
  maxTitleLength?: number;
};

/** Max chars for meta titles. Search engines commonly truncate around ~60 chars. */
const MAX_META_TITLE_LENGTH = 60;

/** Max chars for meta description. Google shows ~155 chars on desktop, ~120 on mobile. */
const MAX_META_DESCRIPTION_LENGTH = 155;

/** Only transforms ALL-CAPS identifiers (e.g. "ACTION 1.1" → "Action 1.1").
 *  Mixed-case input (e.g. "Acció 1.1") passes through unchanged. */
function titleCaseIdentifier(id: string): string {
  if (id !== id.toUpperCase()) return id;
  return id
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function buildTruncatedTitle(
  identifier: string,
  subtitle: string | null,
  maxLen: number,
): string {
  const id = titleCaseIdentifier(identifier);
  if (!subtitle) return truncateAtWordBoundary(id, maxLen);
  const combined = `${id}: ${subtitle}`;
  return truncateAtWordBoundary(combined, maxLen);
}

function firstParagraph(markdown: string): string | null {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .map((chunk) => stripMarkdownFormatting(chunk))
    .find(Boolean);

  return paragraph ?? null;
}

export function getContentPageMetadata(
  content: ContentPageMetaSource,
  options?: ContentPageMetaOptions
): { title: string; description: string | undefined } {
  const titleMode = options?.title ?? "identifier";
  const descriptionMode = options?.description ?? "subtitle";
  const maxLen = options?.maxTitleLength ?? MAX_META_TITLE_LENGTH;
  const title =
    titleMode === "identifier-with-subtitle"
      ? buildTruncatedTitle(content.identifier, content.subtitle, maxLen)
      : titleMode === "subtitle-or-identifier"
        ? content.subtitle ?? content.identifier
        : content.identifier;

  const description =
    descriptionMode === "first-paragraph"
      ? (() => {
          const paragraph = firstParagraph(content.body);
          return paragraph
            ? truncateAtWordBoundary(paragraph, MAX_META_DESCRIPTION_LENGTH)
            : undefined;
        })()
      : content.subtitle ?? undefined;

  return {
    title,
    description,
  };
}
