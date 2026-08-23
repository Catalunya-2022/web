import { describe, it, expect } from "vitest";
import {
  buildAbsoluteUrl,
  buildAlternates,
  getOGLocale,
  getAlternateOGLocales,
  ogImagePath,
} from "../metadata";

describe("getOGLocale", () => {
  it("returns ca_ES for CA", () => {
    expect(getOGLocale("ca")).toBe("ca_ES");
  });

  it("returns en_US for EN", () => {
    expect(getOGLocale("en")).toBe("en_US");
  });

  it("returns es_ES for ES", () => {
    expect(getOGLocale("es")).toBe("es_ES");
  });
});

describe("getAlternateOGLocales", () => {
  it("excludes current locale", () => {
    const alts = getAlternateOGLocales("ca");
    expect(alts).toEqual(["en_US", "es_ES"]);
    expect(alts).not.toContain("ca_ES");
  });
});

describe("buildAbsoluteUrl", () => {
  it("builds CA home URL", () => {
    expect(buildAbsoluteUrl("/", "ca")).toBe("https://2022.cat/");
  });

  it("builds EN introduction URL", () => {
    expect(buildAbsoluteUrl("/introduction", "en")).toBe(
      "https://2022.cat/en/introduction"
    );
  });

  it("builds ES introduction URL with translated slug", () => {
    expect(buildAbsoluteUrl("/introduction", "es")).toBe(
      "https://2022.cat/es/introduccion"
    );
  });

  it("builds CA introduction URL with translated slug", () => {
    expect(buildAbsoluteUrl("/introduction", "ca")).toBe(
      "https://2022.cat/introduccio"
    );
  });
});

describe("buildAlternates", () => {
  it("returns canonical and all language alternates", () => {
    const alts = buildAlternates("/introduction", "en");

    expect(alts.canonical).toBe("https://2022.cat/en/introduction");
    expect(alts.languages).toEqual({
      ca: "https://2022.cat/introduccio",
      en: "https://2022.cat/en/introduction",
      es: "https://2022.cat/es/introduccion",
      "x-default": "https://2022.cat/introduccio",
    });
  });

  it("x-default always points to CA URL", () => {
    const alts = buildAlternates("/action-plan", "es");
    expect(alts.languages?.["x-default"]).toBe("https://2022.cat/pla-accio");
  });

  it("handles root path", () => {
    const alts = buildAlternates("/", "ca");
    expect(alts.canonical).toBe("https://2022.cat/");
    expect(alts.languages?.en).toBe("https://2022.cat/en");
    expect(alts.languages?.es).toBe("https://2022.cat/es");
  });
});

describe("ogImagePath", () => {
  it("home page — CA pathless, EN/ES prefixed", () => {
    expect(ogImagePath("/", "ca")).toBe("og/home.png");
    expect(ogImagePath("/", "en")).toBe("og/en/home.png");
    expect(ogImagePath("/", "es")).toBe("og/es/home.png");
  });

  it("CA content article — translated slug, no prefix", () => {
    expect(ogImagePath("/introduction", "ca")).toBe("og/introduccio.png");
  });

  it("EN hierarchy — with en/ prefix", () => {
    expect(ogImagePath("/sphere-1/goal-2", "en")).toBe(
      "og/en/sphere-1/goal-2.png"
    );
  });

  it("ES member profile — translated segments with es/ prefix", () => {
    expect(ogImagePath("/task-force/victoria-alsina", "es")).toBe(
      "og/es/grupo-de-trabajo/victoria-alsina.png"
    );
  });

  it("all paths are relative, start with og/, end with .png", () => {
    const cases = [
      ogImagePath("/", "ca"),
      ogImagePath("/introduction", "en"),
      ogImagePath("/sphere-1/goal-2/action-2-1", "es"),
      ogImagePath("/action-plan", "ca"),
    ];
    for (const p of cases) {
      expect(p).not.toMatch(/^\//);
      expect(p).toMatch(/^og\//);
      expect(p).toMatch(/\.png$/);
    }
  });
});
