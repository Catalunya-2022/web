import { describe, expect, it } from "vitest";
import sitemap from "../sitemap";
import { routing } from "@/i18n/routing";
import { EXPECTED_COUNTS } from "@/test/contract";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

describe("sitemap", () => {
  it("lists every locale-backed page once per locale", async () => {
    const entries = await sitemap();
    expect(entries).toHaveLength(EXPECTED_COUNTS.routesPerLocale * routing.locales.length);
    expect(entries).toHaveLength(EXPECTED_COUNTS.staticPages);
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("gives every entry absolute URLs and a full hreflang cluster", async () => {
    const entries = await sitemap();
    for (const entry of entries) {
      expect(entry.url.startsWith("https://2022.cat")).toBe(true);
      const languages = entry.alternates?.languages as Record<string, string> | undefined;
      expect(languages, entry.url).toBeDefined();
      expect(Object.keys(languages!).sort()).toEqual(["ca", "en", "es", "x-default"]);
      expect(languages!["x-default"]).toBe(languages!.ca);
      for (const href of Object.values(languages!)) {
        expect(href.startsWith("https://2022.cat")).toBe(true);
      }
      expect(Object.values(languages!)).toContain(entry.url);
    }
  });

  it("carries a valid lastmod on every entry", async () => {
    const entries = await sitemap();
    for (const entry of entries) {
      const value = String(entry.lastModified);
      expect(value, entry.url).toMatch(ISO_DATE);
      expect(Number.isNaN(new Date(value).getTime()), entry.url).toBe(false);
    }
  });
});
