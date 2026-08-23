import { describe, it, expect } from "vitest";
import { getManifest } from "../content-manifest";

describe("getManifest", () => {
  it("covers 117 pages per locale: 109 content + 7 supplementary + home", async () => {
    for (const locale of ["ca", "en", "es"] as const) {
      const manifest = await getManifest(locale);
      expect(manifest.entries.size).toBe(117);
      expect(manifest.readingOrder).toHaveLength(117);
    }
  });

  it("has a titled entry for every reading-order slug", async () => {
    const manifest = await getManifest("en");
    for (const slug of manifest.readingOrder) {
      const entry = manifest.entries.get(slug);
      expect(entry, `missing entry for ${slug}`).toBeDefined();
      expect(entry!.identifier).not.toBe("");
      expect(entry!.pageTitle).not.toBe("");
    }
  });

  it("keeps identical slug sets across locales", async () => {
    const [ca, en, es] = await Promise.all([
      getManifest("ca"),
      getManifest("en"),
      getManifest("es"),
    ]);
    const caSlugs = [...ca.entries.keys()].sort();
    expect([...en.entries.keys()].sort()).toEqual(caSlugs);
    expect([...es.entries.keys()].sort()).toEqual(caSlugs);
  });

  it("returns the cached manifest on repeat calls", async () => {
    const first = await getManifest("en");
    const second = await getManifest("en");
    expect(second).toBe(first);
  });

  it("rejects invalid locales", async () => {
    await expect(
      getManifest("fr" as unknown as Parameters<typeof getManifest>[0])
    ).rejects.toThrow();
  });
});
