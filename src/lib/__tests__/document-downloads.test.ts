import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { DOCUMENT_FORMATS, documentDownloadPath, documentDownloadUrl } from "../document-downloads";

const LITERAL_PATHS = {
  ca: {
    pdf: "/documents/catalunya-2022-ca.pdf",
    epub: "/documents/catalunya-2022-ca.epub",
    md: "/documents/catalunya-2022-ca.md",
  },
  en: {
    pdf: "/documents/catalunya-2022-en.pdf",
    epub: "/documents/catalunya-2022-en.epub",
    md: "/documents/catalunya-2022-en.md",
  },
  es: {
    pdf: "/documents/catalunya-2022-es.pdf",
    epub: "/documents/catalunya-2022-es.epub",
    md: "/documents/catalunya-2022-es.md",
  },
} as const;

describe("document downloads", () => {
  it("exposes exactly the three download formats", () => {
    expect(DOCUMENT_FORMATS).toEqual(["pdf", "epub", "md"]);
  });

  it("builds the nine relative paths and absolute URLs byte for byte", () => {
    const seen = new Set<string>();
    for (const locale of routing.locales) {
      for (const format of DOCUMENT_FORMATS) {
        const literal = LITERAL_PATHS[locale][format];
        expect(documentDownloadPath(locale, format)).toBe(literal);
        expect(documentDownloadUrl(locale, format)).toBe(`https://2022.cat${literal}`);
        seen.add(literal);
      }
    }
    expect(seen.size).toBe(9);
  });
});
