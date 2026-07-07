import { describe, it, expect } from "vitest";
import {
  localizeHref,
  detectLocale,
  toCanonicalPath,
  buildSphereSlug,
  buildGoalSlug,
  buildActionSlug,
  buildCanonicalSpherePath,
  buildCanonicalGoalPath,
  buildCanonicalActionId,
  buildCanonicalActionPath,
  parseSegmentId,
  parseHierarchySlug,
  resolveSphereParams,
  resolveGoalParams,
  resolveActionParams,
  shortHierarchyLabel,
  resolveLocalizedRoute,
  detectHierarchyLocale,
  resolveRoute,
} from "../path-utils";
import type { Locale } from "@/i18n/routing";

describe("localizeHref", () => {
  it("returns / for CA home", () => {
    expect(localizeHref("/", "ca")).toBe("/");
  });

  it("returns /en for EN home (no trailing slash)", () => {
    expect(localizeHref("/", "en")).toBe("/en");
  });

  it("returns /es for ES home (no trailing slash)", () => {
    expect(localizeHref("/", "es")).toBe("/es");
  });

  it("translates /introduction to CA", () => {
    expect(localizeHref("/introduction", "ca")).toBe("/introduccio");
  });

  it("translates /introduction to ES", () => {
    expect(localizeHref("/introduction", "es")).toBe("/es/introduccion");
  });

  it("keeps /introduction as-is for EN", () => {
    expect(localizeHref("/introduction", "en")).toBe("/en/introduction");
  });

  it("translates deep sphere/goal/action path to ES", () => {
    expect(localizeHref("/sphere-1/goal-2/action-2-1", "es")).toBe(
      "/es/ambito-1/objetivo-2/accion-2-1"
    );
  });

  it("translates deep sphere/goal/action path to CA", () => {
    expect(localizeHref("/sphere-1/goal-2/action-2-1", "ca")).toBe(
      "/ambit-1/objectiu-2/accio-2-1"
    );
  });

  it("passes through member slugs unchanged", () => {
    expect(localizeHref("/task-force/victoria-alsina", "en")).toBe(
      "/en/task-force/victoria-alsina"
    );
  });

  it("translates task-force segment for CA", () => {
    expect(localizeHref("/task-force/victoria-alsina", "ca")).toBe(
      "/grup-de-treball/victoria-alsina"
    );
  });

  it("translates executive-summary for all locales", () => {
    expect(localizeHref("/executive-summary", "ca")).toBe("/resum-executiu");
    expect(localizeHref("/executive-summary", "es")).toBe(
      "/es/resumen-ejecutivo"
    );
    expect(localizeHref("/executive-summary", "en")).toBe(
      "/en/executive-summary"
    );
  });
});

describe("detectLocale", () => {
  it("detects EN from /en/introduction", () => {
    expect(detectLocale("/en/introduction")).toBe("en");
  });

  it("detects ES from /es/ambito-1", () => {
    expect(detectLocale("/es/ambito-1")).toBe("es");
  });

  it("defaults to CA for pathless routes", () => {
    expect(detectLocale("/introduccio")).toBe("ca");
    expect(detectLocale("/")).toBe("ca");
  });

  it("detects EN from bare /en", () => {
    expect(detectLocale("/en")).toBe("en");
  });
});

describe("toCanonicalPath", () => {
  it("reverse-translates ES sphere/goal path", () => {
    expect(toCanonicalPath("/es/ambito-1/objetivo-2")).toBe(
      "/sphere-1/goal-2"
    );
  });

  it("reverse-translates CA segments", () => {
    expect(toCanonicalPath("/introduccio")).toBe("/introduction");
  });

  it("reverse-translates CA action-plan", () => {
    expect(toCanonicalPath("/pla-accio")).toBe("/action-plan");
  });

  it("passes through EN paths unchanged", () => {
    expect(toCanonicalPath("/en/introduction")).toBe("/introduction");
  });

  it("handles root path", () => {
    expect(toCanonicalPath("/")).toBe("/");
  });
});

describe("dynamic param collision guard", () => {
  it("does not translate member slug 'press' as the /press route (CA)", () => {
    expect(localizeHref("/task-force/press", "ca")).toBe("/grup-de-treball/press");
  });

  it("does not translate member slug 'press' as the /press route (ES)", () => {
    expect(localizeHref("/task-force/press", "es")).toBe("/es/grupo-de-trabajo/press");
  });

  it("round-trips /task-force/press through toCanonicalPath (CA)", () => {
    expect(toCanonicalPath("/grup-de-treball/press")).toBe("/task-force/press");
  });

  it("round-trips /task-force/press through toCanonicalPath (ES)", () => {
    expect(toCanonicalPath("/es/grupo-de-trabajo/press")).toBe("/task-force/press");
  });
});

describe("dynamic routes — sphere/goal/action all locales", () => {
  it("localizes /sphere-1 for all locales", () => {
    expect(localizeHref("/sphere-1", "ca")).toBe("/ambit-1");
    expect(localizeHref("/sphere-1", "en")).toBe("/en/sphere-1");
    expect(localizeHref("/sphere-1", "es")).toBe("/es/ambito-1");
  });

  it("round-trips /sphere-1 for all locales", () => {
    expect(toCanonicalPath("/ambit-1")).toBe("/sphere-1");
    expect(toCanonicalPath("/en/sphere-1")).toBe("/sphere-1");
    expect(toCanonicalPath("/es/ambito-1")).toBe("/sphere-1");
  });

  it("localizes /sphere-1/goal-2 for CA and ES", () => {
    expect(localizeHref("/sphere-1/goal-2", "ca")).toBe("/ambit-1/objectiu-2");
    expect(localizeHref("/sphere-1/goal-2", "es")).toBe("/es/ambito-1/objetivo-2");
  });

  it("round-trips /sphere-1/goal-2 for CA and ES", () => {
    expect(toCanonicalPath("/ambit-1/objectiu-2")).toBe("/sphere-1/goal-2");
    expect(toCanonicalPath("/es/ambito-1/objetivo-2")).toBe("/sphere-1/goal-2");
  });

  it("round-trips action path for CA and ES", () => {
    expect(toCanonicalPath("/ambit-1/objectiu-2/accio-2-1")).toBe(
      "/sphere-1/goal-2/action-2-1"
    );
    expect(toCanonicalPath("/es/ambito-1/objetivo-2/accion-2-1")).toBe(
      "/sphere-1/goal-2/action-2-1"
    );
  });

  it("localizes ES member slug (task-force)", () => {
    expect(localizeHref("/task-force/victoria-alsina", "es")).toBe(
      "/es/grupo-de-trabajo/victoria-alsina"
    );
    expect(toCanonicalPath("/es/grupo-de-trabajo/victoria-alsina")).toBe(
      "/task-force/victoria-alsina"
    );
  });
});

describe("edge cases", () => {
  it("round-trips / for EN and ES (home page)", () => {
    expect(toCanonicalPath("/en")).toBe("/");
    expect(toCanonicalPath("/es")).toBe("/");
  });

  it("handles CA and ES sharing /recursos (both canonicalize to /resources)", () => {
    expect(toCanonicalPath("/recursos")).toBe("/resources");   // CA
    expect(toCanonicalPath("/es/recursos")).toBe("/resources"); // ES
  });
});

describe("slug builders", () => {
  it("builds sphere slugs for all locales", () => {
    expect(buildSphereSlug(1)).toBe("sphere-1");
    expect(buildSphereSlug(1, "ca")).toBe("ambit-1");
    expect(buildSphereSlug(1, "es")).toBe("ambito-1");
  });

  it("builds goal slugs for all locales", () => {
    expect(buildGoalSlug(5)).toBe("goal-5");
    expect(buildGoalSlug(5, "ca")).toBe("objectiu-5");
    expect(buildGoalSlug(5, "es")).toBe("objetivo-5");
  });

  it("builds action slugs for all locales", () => {
    expect(buildActionSlug("2-1")).toBe("action-2-1");
    expect(buildActionSlug("2-1", "ca")).toBe("accio-2-1");
    expect(buildActionSlug("2-1", "es")).toBe("accion-2-1");
  });

  it("builds canonical hierarchy paths", () => {
    expect(buildCanonicalSpherePath(2)).toBe("/sphere-2");
    expect(buildCanonicalGoalPath(2, 7)).toBe("/sphere-2/goal-7");
    expect(buildCanonicalActionId(7, 3)).toBe("7-3");
    expect(buildCanonicalActionPath(2, 7, "7-3")).toBe(
      "/sphere-2/goal-7/action-7-3"
    );
  });
});

describe("parseSegmentId", () => {
  it("parses sphere segments from all locales", () => {
    expect(parseSegmentId("sphere-1")).toEqual({ type: "sphere", id: "1" });
    expect(parseSegmentId("ambit-2")).toEqual({ type: "sphere", id: "2" });
    expect(parseSegmentId("ambito-3")).toEqual({ type: "sphere", id: "3" });
  });

  it("parses goal segments from all locales", () => {
    expect(parseSegmentId("goal-5")).toEqual({ type: "goal", id: "5" });
    expect(parseSegmentId("objectiu-10")).toEqual({ type: "goal", id: "10" });
    expect(parseSegmentId("objetivo-12")).toEqual({ type: "goal", id: "12" });
  });

  it("parses action segments from all locales", () => {
    expect(parseSegmentId("action-2-1")).toEqual({ type: "action", id: "2-1" });
    expect(parseSegmentId("accio-12-4")).toEqual({ type: "action", id: "12-4" });
    expect(parseSegmentId("accion-8-3")).toEqual({ type: "action", id: "8-3" });
  });

  it("returns null for non-matching segments", () => {
    expect(parseSegmentId("introduction")).toBeNull();
    expect(parseSegmentId("task-force")).toBeNull();
  });
});

describe("resolveSphereParams", () => {
  it("resolves valid sphere segments across all locale prefixes", () => {
    expect(resolveSphereParams("sphere-1")).toEqual({ sphereId: 1 });
    expect(resolveSphereParams("ambit-2")).toEqual({ sphereId: 2 });
    expect(resolveSphereParams("ambito-3")).toEqual({ sphereId: 3 });
  });

  it("returns null for out-of-range sphere ID", () => {
    expect(resolveSphereParams("sphere-4")).toBeNull();
    expect(resolveSphereParams("sphere-0")).toBeNull();
  });

  it("returns null for wrong type segment", () => {
    expect(resolveSphereParams("goal-1")).toBeNull();
    expect(resolveSphereParams("action-1-1")).toBeNull();
  });

  it("returns null for non-matching segment", () => {
    expect(resolveSphereParams("introduction")).toBeNull();
  });
});

describe("resolveGoalParams", () => {
  it("resolves valid sphere + goal", () => {
    expect(resolveGoalParams("sphere-1", "goal-1")).toEqual({ sphereId: 1, goalId: 1 });
    expect(resolveGoalParams("ambit-2", "objectiu-5")).toEqual({ sphereId: 2, goalId: 5 });
    expect(resolveGoalParams("ambito-3", "objetivo-12")).toEqual({ sphereId: 3, goalId: 12 });
  });

  it("returns null for goal not belonging to sphere", () => {
    expect(resolveGoalParams("sphere-1", "goal-5")).toBeNull();
    expect(resolveGoalParams("sphere-2", "goal-1")).toBeNull();
    expect(resolveGoalParams("sphere-3", "goal-8")).toBeNull();
  });

  it("returns null for invalid sphere", () => {
    expect(resolveGoalParams("sphere-4", "goal-1")).toBeNull();
  });

  it("returns null for wrong type segment as goal", () => {
    expect(resolveGoalParams("sphere-1", "sphere-1")).toBeNull();
    expect(resolveGoalParams("sphere-1", "action-1-1")).toBeNull();
  });
});

describe("parseHierarchySlug", () => {
  it("parses sphere, goal, and action paths", () => {
    expect(parseHierarchySlug("/sphere-2")).toEqual({
      kind: "sphere",
      sphereId: 2,
    });
    expect(parseHierarchySlug("/sphere-2/goal-5")).toEqual({
      kind: "goal",
      sphereId: 2,
      goalId: 5,
    });
    expect(parseHierarchySlug("/sphere-2/goal-5/action-5-3")).toEqual({
      kind: "action",
      sphereId: 2,
      goalId: 5,
      actionId: "5-3",
    });
  });

  it("returns null for non-hierarchy slugs", () => {
    expect(parseHierarchySlug("/introduction")).toBeNull();
    expect(parseHierarchySlug("/task-force/victoria-alsina")).toBeNull();
  });

  it("parses localized hierarchy slugs without a locale prefix", () => {
    expect(parseHierarchySlug("/ambit-2/objectiu-5")).toEqual({
      kind: "goal",
      sphereId: 2,
      goalId: 5,
    });
  });

  it("returns null for empty or malformed hierarchy shapes", () => {
    expect(parseHierarchySlug("")).toBeNull();
    expect(parseHierarchySlug("/")).toBeNull();
    expect(parseHierarchySlug("/sphere-1/goal-1/action-1-1/extra")).toBeNull();
  });
});

describe("shortHierarchyLabel", () => {
  it("formats localized short labels from a canonical slug", () => {
    expect(shortHierarchyLabel("/sphere-3", "en")).toBe("Sphere 3");
    expect(shortHierarchyLabel("/sphere-3/goal-12", "ca")).toBe("Objectiu 12");
    expect(shortHierarchyLabel("/sphere-3/goal-12/action-12-4", "es")).toBe(
      "Acción 12.4"
    );
  });

  it("returns null for non-hierarchy slugs", () => {
    expect(shortHierarchyLabel("/resources", "en")).toBeNull();
  });
});

describe("resolveActionParams", () => {
  it("resolves valid full hierarchy", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-1-1")).toEqual({
      sphereId: 1, goalId: 1, actionId: "1-1",
    });
    expect(resolveActionParams("ambit-2", "objectiu-5", "accio-5-12")).toEqual({
      sphereId: 2, goalId: 5, actionId: "5-12",
    });
  });

  it("returns null when action number exceeds ACTION_COUNTS", () => {
    // Goal 1 has 9 actions
    expect(resolveActionParams("sphere-1", "goal-1", "action-1-10")).toBeNull();
  });

  it("returns null when action goal prefix does not match goal", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-2-1")).toBeNull();
  });

  it("returns null for malformed action ID with no dash", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-1")).toBeNull();
  });

  it("returns null for non-numeric action part", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-1-abc")).toBeNull();
  });

  it("returns null for extra segments in action ID", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-1-2-3")).toBeNull();
  });

  it("returns null for action-0 (zero is not valid)", () => {
    expect(resolveActionParams("sphere-1", "goal-1", "action-1-0")).toBeNull();
  });
});

describe("resolveLocalizedRoute", () => {
  it("resolves static + dynamic routes for all three locales", () => {
    // CA static
    expect(resolveLocalizedRoute("/grup-de-treball", "ca")).toEqual({ canonical: "/task-force" });
    expect(resolveLocalizedRoute("/introduccio", "ca")).toEqual({ canonical: "/introduction" });
    // CA dynamic — the bug case
    expect(resolveLocalizedRoute("/grup-de-treball/victoria-alsina", "ca")).toEqual({
      canonical: "/task-force/victoria-alsina",
    });
    // EN dynamic
    expect(resolveLocalizedRoute("/en/task-force/victoria-alsina", "en")).toEqual({
      canonical: "/task-force/victoria-alsina",
    });
    // ES dynamic
    expect(resolveLocalizedRoute("/es/grupo-de-trabajo/victoria-alsina", "es")).toEqual({
      canonical: "/task-force/victoria-alsina",
    });
    // Root
    expect(resolveLocalizedRoute("/", "ca")).toEqual({ canonical: "/" });
  });

  it("returns null for unknown and locale-mismatched paths", () => {
    expect(resolveLocalizedRoute("/foo/bar", "ca")).toBeNull();
    expect(resolveLocalizedRoute("/random", "ca")).toBeNull();
    // CA-localized segment must NOT match in EN locale
    expect(resolveLocalizedRoute("/grup-de-treball/victoria-alsina", "en")).toBeNull();
    // EN-canonical segment must NOT match in CA locale
    expect(resolveLocalizedRoute("/task-force/victoria-alsina", "ca")).toBeNull();
    // CRITICAL — hierarchy paths must NOT match the catalog. They're handled
    // by a separate branch (detectHierarchyLocale). If resolveLocalizedRoute
    // accidentally matched a hierarchy path, it would be dispatched as a
    // "localized" kind and the hierarchy branch would never run. Load-bearing
    // for correctness of the resolveRoute call order.
    expect(resolveLocalizedRoute("/ambit-1", "ca")).toBeNull();
    expect(resolveLocalizedRoute("/en/sphere-1", "en")).toBeNull();
    expect(resolveLocalizedRoute("/es/ambito-1/objetivo-4/accion-4-3", "es")).toBeNull();
  });

  it("handles path edge cases without throwing", () => {
    // Empty string -> effectively root
    expect(resolveLocalizedRoute("", "ca")).toEqual({ canonical: "/" });
    // Trailing slash -> filter(Boolean) drops empty segments
    expect(resolveLocalizedRoute("/grup-de-treball/", "ca")).toEqual({ canonical: "/task-force" });
    // Double slash -> filter(Boolean) drops empty segments
    expect(resolveLocalizedRoute("/grup-de-treball//victoria-alsina", "ca")).toEqual({
      canonical: "/task-force/victoria-alsina",
    });
    // Unicode in dynamic segment — should match
    expect(resolveLocalizedRoute("/grup-de-treball/josé-garcía", "ca")).toEqual({
      canonical: "/task-force/josé-garcía",
    });
    // Cyrillic homograph — must NOT match Latin literal
    expect(resolveLocalizedRoute("/gru\u0440-de-treball/x", "ca")).toBeNull();
  });

  // Invariant: any path the helper accepts must round-trip
  // through localizeHref(toCanonicalPath(p), l). Cheap insurance against future
  // drift in translateSegment's identity-fallback behavior.
  it("[invariant] resolveLocalizedRoute matches imply localizeHref round-trip", () => {
    const samples = [
      ["/grup-de-treball", "ca"],
      ["/grup-de-treball/victoria-alsina", "ca"],
      ["/en/task-force/victoria-alsina", "en"],
      ["/es/grupo-de-trabajo/victoria-alsina", "es"],
      ["/introduccio", "ca"],
      ["/en/executive-summary", "en"],
      ["/es/resumen-ejecutivo", "es"],
    ] as const satisfies ReadonlyArray<readonly [string, Locale]>;

    for (const [path, locale] of samples) {
      const resolved = resolveLocalizedRoute(path, locale);
      // Per-sample error message — prevents misleading
      // "Cannot read properties of null" errors in the next assertion.
      expect(resolved, `expected ${path} (${locale}) to resolve`).not.toBeNull();
      expect(localizeHref(resolved!.canonical, locale)).toBe(path);
    }

    // Negative case: Cyrillic homograph of /ambit-1 must NOT resolve in any locale.
    // Protects against future translateSegment identity-fallback drift where a
    // Cyrillic lookalike could accidentally match the Latin-script pattern.
    expect(resolveLocalizedRoute("/\u0430mbit-1", "ca")).toBeNull();
    expect(resolveLocalizedRoute("/\u0430mbit-1", "en")).toBeNull();
  });
});

describe("detectHierarchyLocale", () => {
  it("detects CA/EN/ES from hierarchy prefixes", () => {
    expect(detectHierarchyLocale("/ambit-1")).toBe("ca");
    expect(detectHierarchyLocale("/ambit-2/objectiu-7")).toBe("ca");
    expect(detectHierarchyLocale("/sphere-2")).toBe("en");
    expect(detectHierarchyLocale("/sphere-1/goal-4/action-4-3")).toBe("en");
    expect(detectHierarchyLocale("/ambito-3")).toBe("es");
    expect(detectHierarchyLocale("/ambito-1/objetivo-4/accion-4-3")).toBe("es");
  });

  it("returns null for non-hierarchy paths", () => {
    expect(detectHierarchyLocale("/task-force")).toBeNull();
    expect(detectHierarchyLocale("/grup-de-treball")).toBeNull();
    expect(detectHierarchyLocale("/introduccio")).toBeNull();
    expect(detectHierarchyLocale("/")).toBeNull();
    expect(detectHierarchyLocale("")).toBeNull();
  });

  // CRITICAL — locale-prefixed paths must return null. Breaking this would
  // cause infinite rewrite loops (the proxy would intercept /en/sphere-1,
  // rewrite to /ca/en/sphere-1, re-enter, ...).
  it("[critical] returns null for locale-prefixed paths", () => {
    expect(detectHierarchyLocale("/en/sphere-1")).toBeNull();
    expect(detectHierarchyLocale("/en/sphere-1/goal-4/action-4-3")).toBeNull();
    expect(detectHierarchyLocale("/es/ambito-1")).toBeNull();
    expect(detectHierarchyLocale("/es/ambito-1/objetivo-4/accion-4-3")).toBeNull();
  });

  // Document current behavior: invalid IDs that still match a known prefix
  // pass through the prefix check. Page-level 404 handles the invalid ID downstream.
  it("matches prefix even for out-of-range IDs (404 at page level)", () => {
    expect(detectHierarchyLocale("/ambit-99")).toBe("ca");
    expect(detectHierarchyLocale("/sphere-99")).toBe("en");
  });
});

describe("resolveRoute", () => {
  it("returns { kind: 'localized' } for static + dynamic catalog routes", () => {
    // CA static
    expect(resolveRoute("/grup-de-treball", "ca")).toEqual({
      kind: "localized",
      canonical: "/task-force",
      locale: "ca",
    });
    // CA dynamic — the Bug B case
    expect(resolveRoute("/grup-de-treball/victoria-alsina", "ca")).toEqual({
      kind: "localized",
      canonical: "/task-force/victoria-alsina",
      locale: "ca",
    });
    // EN dynamic with prefix
    expect(resolveRoute("/en/task-force/victoria-alsina", "en")).toEqual({
      kind: "localized",
      canonical: "/task-force/victoria-alsina",
      locale: "en",
    });
    // ES supplementary
    expect(resolveRoute("/es/recursos", "es")).toEqual({
      kind: "localized",
      canonical: "/resources",
      locale: "es",
    });
  });

  it("returns { kind: 'hierarchy-ca' } for CA pathless hierarchy routes", () => {
    expect(resolveRoute("/ambit-1", "ca")).toEqual({ kind: "hierarchy-ca", locale: "ca" });
    expect(resolveRoute("/ambit-1/objectiu-2", "ca")).toEqual({ kind: "hierarchy-ca", locale: "ca" });
    expect(resolveRoute("/ambit-2/objectiu-7/accio-7-3", "ca")).toEqual({
      kind: "hierarchy-ca",
      locale: "ca",
    });
  });

  it("returns { kind: 'hierarchy-redirect' } for non-CA hierarchy without locale prefix", () => {
    expect(resolveRoute("/sphere-1", "ca")).toEqual({ kind: "hierarchy-redirect", locale: "en" });
    expect(resolveRoute("/sphere-2/goal-6/action-6-3", "ca")).toEqual({
      kind: "hierarchy-redirect",
      locale: "en",
    });
    expect(resolveRoute("/ambito-1", "ca")).toEqual({ kind: "hierarchy-redirect", locale: "es" });
    expect(resolveRoute("/ambito-1/objetivo-4/accion-4-3", "ca")).toEqual({
      kind: "hierarchy-redirect",
      locale: "es",
    });
  });

  it("returns null for unknown paths (falls through to intlMiddleware)", () => {
    expect(resolveRoute("/foo/bar", "ca")).toBeNull();
    expect(resolveRoute("/random", "ca")).toBeNull();
    // Already-prefixed EN hierarchy paths return null from resolveRoute — the
    // hierarchy branch expects unprefixed paths. intlMiddleware handles these.
    expect(resolveRoute("/en/sphere-1", "en")).toBeNull();
    expect(resolveRoute("/es/ambito-1", "es")).toBeNull();
  });
});
