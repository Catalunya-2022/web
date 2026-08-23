import { cache } from "react";
import fs from "fs/promises";
import type { Locale } from "@/i18n/routing";
import { getContentDir, extractHeadings, slugToFilePath } from "@/lib/content-utils";

export type ParsedContent = {
  identifier: string;
  subtitle: string;
  body: string;
  raw: string;
};

function parseHeadings(raw: string): {
  identifier: string;
  subtitle: string;
  body: string;
} {
  const lines = raw.split("\n");
  const { h1, h2, bodyStartIndex } = extractHeadings(raw);

  let start = bodyStartIndex;
  while (start < lines.length && lines[start].trim() === "") start++;

  const body = lines.slice(start).join("\n").trim();
  return { identifier: h1, subtitle: h2, body };
}

export const loadContent = cache(
  async (slug: string, locale: Locale): Promise<ParsedContent> => {
    const filePath = slugToFilePath(slug, getContentDir(locale));
    let raw: string;
    try {
      raw = await fs.readFile(filePath, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to read content for "${slug}" (locale: ${locale}, file: ${filePath}): ${error instanceof Error ? error.message : String(error)}`
      );
    }
    const { identifier, subtitle, body } = parseHeadings(raw);
    return { identifier, subtitle, body, raw };
  }
);
