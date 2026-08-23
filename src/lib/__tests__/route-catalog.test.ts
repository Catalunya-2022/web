import { describe, it, expect } from "vitest";
import { ROUTE_CATALOG } from "../route-catalog";
import { localizeHref, toCanonicalPath } from "../path-utils";
import { routing } from "@/i18n/routing";

describe("ROUTE_CATALOG → routing.ts consistency", () => {
  it("routing.pathnames keys match ROUTE_CATALOG keys", () => {
    const catalogKeys = new Set(Object.keys(ROUTE_CATALOG));
    const routingKeys = new Set(Object.keys(routing.pathnames));
    expect(catalogKeys).toEqual(routingKeys);
  });

  it("routing.pathnames values match ROUTE_CATALOG values for all locales", () => {
    for (const [key, patterns] of Object.entries(ROUTE_CATALOG)) {
      const routingPatterns = routing.pathnames[key as keyof typeof routing.pathnames];
      expect(routingPatterns).toEqual(patterns);
    }
  });
});

describe("Round-trip: canonical → localizeHref → toCanonicalPath", () => {
  const staticRoutes = [
    "/introduction",
    "/executive-summary",
    "/train-of-prosperity",
    "/action-plan",
    "/task-force",
    "/organizations",
    "/people-consulted",
    "/press",
    "/resources",
  ];

  for (const slug of staticRoutes) {
    for (const locale of ["ca", "en", "es"] as const) {
      it(`round-trips ${slug} (${locale})`, () => {
        const localized = localizeHref(slug, locale);
        const canonical = toCanonicalPath(localized);
        expect(canonical).toBe(slug);
      });
    }
  }
});

describe("Round-trip: sphere/goal/action routes", () => {
  const dynamicRoutes = [
    "/sphere-1",
    "/sphere-2",
    "/sphere-3",
    "/sphere-1/goal-1",
    "/sphere-2/goal-5",
    "/sphere-3/goal-12",
    "/sphere-1/goal-1/action-1-3",
    "/sphere-2/goal-8/action-8-1",
    "/sphere-3/goal-12/action-12-4",
  ];

  for (const slug of dynamicRoutes) {
    for (const locale of ["ca", "en", "es"] as const) {
      it(`round-trips ${slug} (${locale})`, () => {
        const localized = localizeHref(slug, locale);
        const canonical = toCanonicalPath(localized);
        expect(canonical).toBe(slug);
      });
    }
  }
});

describe("localizeHref matches ROUTE_CATALOG patterns", () => {
  it("/resources localizes correctly for all locales", () => {
    expect(localizeHref("/resources", "ca")).toBe("/recursos");
    expect(localizeHref("/resources", "en")).toBe("/en/resources");
    expect(localizeHref("/resources", "es")).toBe("/es/recursos");
  });

  it("/introduction localizes correctly for all locales", () => {
    expect(localizeHref("/introduction", "ca")).toBe("/introduccio");
    expect(localizeHref("/introduction", "en")).toBe("/en/introduction");
    expect(localizeHref("/introduction", "es")).toBe("/es/introduccion");
  });

  it("/executive-summary localizes correctly for all locales", () => {
    expect(localizeHref("/executive-summary", "ca")).toBe("/resum-executiu");
    expect(localizeHref("/executive-summary", "en")).toBe("/en/executive-summary");
    expect(localizeHref("/executive-summary", "es")).toBe("/es/resumen-ejecutivo");
  });

  it("/press localizes correctly for all locales", () => {
    expect(localizeHref("/press", "ca")).toBe("/premsa");
    expect(localizeHref("/press", "en")).toBe("/en/press");
    expect(localizeHref("/press", "es")).toBe("/es/prensa");
  });
});

describe("Dynamic route round-trips — reserved-word slug collision guard", () => {
  it("round-trips /task-force/[member] with reserved-word slug (ca)", () => {
    const localized = localizeHref("/task-force/press", "ca");
    expect(toCanonicalPath(localized)).toBe("/task-force/press");
  });

  it("round-trips /task-force/[member] with reserved-word slug (es)", () => {
    const localized = localizeHref("/task-force/press", "es");
    expect(toCanonicalPath(localized)).toBe("/task-force/press");
  });
});
