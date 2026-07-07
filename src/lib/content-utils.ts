import path from "node:path";
import { routing } from "@/i18n/routing";
import { isStaticContentSlug } from "@/lib/page-registry";
import { parseHierarchySlug } from "@/lib/path-utils";
import type { Locale } from "@/i18n/routing";

const TRUNCATION_WORD_BOUNDARY_RATIO = 0.6;

/** Truncate text at a word boundary, appending an ellipsis if truncated. */
export function truncateAtWordBoundary(
  text: string,
  maxLen: number,
  ellipsis = "\u2026",
): string {
  if (text.length <= maxLen) return text;
  const shortened = text.slice(0, maxLen);
  const lastSpace = shortened.lastIndexOf(" ");
  return (
    lastSpace > maxLen * TRUNCATION_WORD_BOUNDARY_RATIO
      ? shortened.slice(0, lastSpace)
      : shortened
  ) + ellipsis;
}

/** Strip markdown formatting (headings, links, code, bold, HTML, list markers) to plain text. */
export function stripMarkdownFormatting(value: string): string {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function assertValidLocale(locale: string): asserts locale is Locale {
  if (!(routing.locales as readonly string[]).includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
}

export function getContentDir(locale: Locale): string {
  return path.join(process.cwd(), "content", locale);
}

/** Extract H1 and H2 headings from MDX content, plus the line index where body starts. */
export function extractHeadings(content: string): {
  h1: string;
  h2: string;
  bodyStartIndex: number;
} {
  const lines = content.split("\n");
  let h1 = "";
  let h2: string | null = null;
  let bodyStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!h1 && line.startsWith("# ") && !line.startsWith("## ")) {
      h1 = line.slice(2).trim();
      bodyStartIndex = i + 1;
    } else if (h1 && !h2 && line.startsWith("## ")) {
      h2 = line.slice(3).trim();
      bodyStartIndex = i + 1;
      break;
    } else if (h1 && line.length > 0 && !line.startsWith("#")) {
      break;
    }
  }

  if (!h1) {
    throw new Error("MDX file is missing a required H1 heading (# Title)");
  }

  if (!h2) {
    throw new Error("MDX file is missing a required H2 heading (## Subtitle)");
  }

  return { h1, h2, bodyStartIndex };
}

/**
 * Map a canonical slug to its content file path on disk.
 *
 * New slug format (hyphenated):
 *   /sphere-1           → sphere1/sphere1.mdx
 *   /sphere-1/goal-2    → sphere1/goal2/goal2.mdx
 *   /sphere-1/goal-2/action-2-1 → sphere1/goal2/action-2-1.mdx
 *
 * Top-level pages:
 *   /introduction       → introduction.mdx
 */
export function slugToFilePath(slug: string, contentDir: string): string {
  const segments = slug.split("/").filter(Boolean);
  let relativePath: string;

  const parsed = parseHierarchySlug(slug);
  if (parsed) {
    const sphereDir = `sphere${parsed.sphereId}`;

    if (parsed.kind === "sphere") {
      relativePath = path.join(sphereDir, `${sphereDir}.mdx`);
    } else {
      const goalDir = `goal${parsed.goalId}`;
      relativePath =
        parsed.kind === "goal"
          ? path.join(sphereDir, goalDir, `${goalDir}.mdx`)
          : path.join(sphereDir, goalDir, `action-${parsed.actionId}.mdx`);
    }
  } else {
    if (segments.length !== 1 || !isStaticContentSlug(`/${segments[0]}`)) {
      throw new Error(`Unknown content slug: ${slug}`);
    }
    relativePath = `${segments[0]}.mdx`;
  }

  const resolved = path.resolve(contentDir, relativePath);
  if (!resolved.startsWith(path.resolve(contentDir))) {
    throw new Error("Invalid content path");
  }
  return resolved;
}
