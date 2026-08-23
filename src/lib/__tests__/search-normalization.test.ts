import { describe, it, expect } from "vitest";
import { normalizeForSearch } from "../search-normalization";

describe("normalizeForSearch", () => {
  it("strips Catalan diacritics", () => {
    expect(normalizeForSearch("Òmnium")).toBe("omnium");
    expect(normalizeForSearch("Acadèmia")).toBe("academia");
    expect(normalizeForSearch("acció")).toBe("accio");
    expect(normalizeForSearch("País")).toBe("pais");
  });

  it("strips Spanish diacritics", () => {
    expect(normalizeForSearch("Giménez")).toBe("gimenez");
    expect(normalizeForSearch("introducción")).toBe("introduccion");
  });

  it("handles names with accents", () => {
    expect(normalizeForSearch("Lluís")).toBe("lluis");
    expect(normalizeForSearch("Mònica")).toBe("monica");
    expect(normalizeForSearch("Gironès")).toBe("girones");
  });

  it("lowercases and trims", () => {
    expect(normalizeForSearch("  HELLO  ")).toBe("hello");
  });

  it("passes through plain ASCII unchanged", () => {
    expect(normalizeForSearch("test")).toBe("test");
    expect(normalizeForSearch("omnium")).toBe("omnium");
  });

  it("handles empty string", () => {
    expect(normalizeForSearch("")).toBe("");
  });
});

describe("accent-insensitive matching (integration)", () => {
  const includes = (haystack: string, needle: string) =>
    normalizeForSearch(haystack).includes(normalizeForSearch(needle));

  it("matches org names with ASCII queries", () => {
    expect(includes("Òmnium Cultural", "omnium")).toBe(true);
    expect(includes("País Conscient", "pais")).toBe(true);
    expect(includes("Acadèmia Catalana de la Música", "academia")).toBe(true);
    expect(includes("Acadèmia Catalana de la Música", "musica")).toBe(true);
  });

  it("matches people names with ASCII queries", () => {
    expect(includes("Mònica", "monica")).toBe(true);
    expect(includes("Lluís", "lluis")).toBe(true);
    expect(includes("Giménez", "gimenez")).toBe(true);
    expect(includes("Gironès", "girones")).toBe(true);
  });

  it("still matches exact accented queries", () => {
    expect(includes("Òmnium Cultural", "Òmnium")).toBe(true);
    expect(includes("Mònica", "Mònica")).toBe(true);
  });
});
