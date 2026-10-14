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
import { EXPECTED_COUNTS } from "@/test/contract";

describe("site contracts", () => {
  it("keeps the hierarchy counts stable", () => {
    expect(getSphereIds()).toHaveLength(EXPECTED_COUNTS.spheres);
    expect(getGoalRoutes()).toHaveLength(EXPECTED_COUNTS.goals);
    expect(getActionRoutes()).toHaveLength(EXPECTED_COUNTS.actions);
    expect(buildContentDocumentSlugs()).toHaveLength(EXPECTED_COUNTS.contentFiles);
  });

  it("keeps the locale-backed page count stable", () => {
    const localeBackedPages =
      1 + buildContentDocumentSlugs().length + SUPPLEMENTARY_PAGE_SLUGS.length + teamMembers.length;

    expect(localeBackedPages).toBe(EXPECTED_COUNTS.routesPerLocale);
    expect(localeBackedPages * routing.locales.length).toBe(EXPECTED_COUNTS.staticPages);
  });

  it("keeps each locale manifest stable", async () => {
    for (const locale of routing.locales) {
      const manifest = await getManifest(locale);
      expect(manifest.readingOrder).toHaveLength(EXPECTED_COUNTS.readingOrder);
      expect(manifest.entries.size).toBe(EXPECTED_COUNTS.readingOrder);
      expect(manifest.readingOrder.at(0)).toBe("/");
      expect(manifest.readingOrder.at(-1)).toBe("/mcp");
    }
  });

  it("keeps each locale search corpus stable and deduplicated", () => {
    for (const locale of routing.locales) {
      const corpus = generateCorpus(locale);
      expect(corpus).toHaveLength(EXPECTED_COUNTS.corpusDocs);
      expect(new Set(corpus.map((doc) => doc.slug)).size).toBe(EXPECTED_COUNTS.routesPerLocale);
    }
  });
});
