import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { DOCUMENT_TITLE } from "../citation";
import { buildCuratedIndex, collectLocaleData } from "../llms-index";

const WHEN_TO_USE_HEADINGS = {
  ca: "## Quan utilitzar aquest lloc",
  en: "## When to Use This Site",
  es: "## Cuándo utilizar este sitio",
} as const;

describe("llms.txt curated index", () => {
  it.each(routing.locales)(
    "includes when-to-use guidance for agents (%s)",
    async (locale) => {
      const index = buildCuratedIndex(locale, await collectLocaleData(locale));

      expect(index).toContain(WHEN_TO_USE_HEADINGS[locale]);
      // The guidance must name the concrete access paths, not marketing copy.
      expect(index).toContain("https://mcp.2022.cat");
      expect(index).toContain("`.md`");
    }
  );

  it("keeps the established document structure around the new section", async () => {
    const index = buildCuratedIndex("ca", await collectLocaleData("ca"));

    expect(index.startsWith(`# ${DOCUMENT_TITLE.ca}`)).toBe(true);
    expect(index).toContain("DOI: https://doi.org/10.5281/zenodo.19500831");
    // When-to-use guidance sits before the canonical documents section.
    expect(index.indexOf(WHEN_TO_USE_HEADINGS.ca)).toBeLessThan(
      index.indexOf("## Documents Canònics")
    );
    expect(index).toContain("https://2022.cat/ambit-1/objectiu-2");
    expect(index).toContain("## Política lingüística");
  });

  it("localizes hierarchy links per locale", async () => {
    const en = buildCuratedIndex("en", await collectLocaleData("en"));
    const es = buildCuratedIndex("es", await collectLocaleData("es"));

    expect(en).toContain("https://2022.cat/en/sphere-1/goal-1");
    expect(es).toContain("https://2022.cat/es/ambito-1/objetivo-1");
  });
});
