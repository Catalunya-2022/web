import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { teamMembers } from "@/lib/data/team-members";
import { getManifest } from "@/lib/content-manifest";
import {
  SUPPLEMENTARY_PAGE_SLUGS,
  buildContentDocumentSlugs,
  getActionRoutes,
  getGoalRoutes,
  getSphereIds,
} from "@/lib/page-registry";
import { generateCorpus } from "@/lib/search-corpus";

describe("site contracts", () => {
  it("keeps the hierarchy counts stable", () => {
    expect(getSphereIds()).toHaveLength(3);
    expect(getGoalRoutes()).toHaveLength(12);
    expect(getActionRoutes()).toHaveLength(91);
    expect(buildContentDocumentSlugs()).toHaveLength(109);
  });

  it("keeps the locale-backed page count stable", () => {
    const localeBackedPages =
      1 + buildContentDocumentSlugs().length + SUPPLEMENTARY_PAGE_SLUGS.length + teamMembers.length;

    expect(localeBackedPages).toBe(147);
    expect(localeBackedPages * routing.locales.length).toBe(441);
  });

  it("keeps each locale manifest stable", async () => {
    for (const locale of routing.locales) {
      const manifest = await getManifest(locale);
      expect(manifest.readingOrder).toHaveLength(117);
      expect(manifest.entries.size).toBe(117);
      expect(manifest.readingOrder.at(0)).toBe("/");
      expect(manifest.readingOrder.at(-1)).toBe("/mcp");
    }
  });

  it("keeps each locale search corpus stable and deduplicated", () => {
    for (const locale of routing.locales) {
      const corpus = generateCorpus(locale);
      expect(corpus).toHaveLength(147);
      expect(new Set(corpus.map((doc) => doc.slug)).size).toBe(147);
    }
  });
});
