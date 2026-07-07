import { ROUTE_CATALOG, SEGMENT_PREFIXES } from "@/lib/route-catalog";
import type { Locale } from "@/i18n/routing";
import { SPHERE_GOALS, ACTION_COUNTS, type SphereId, type GoalId } from "@/lib/data/constants";
import { uiStrings } from "@/lib/ui-strings";

type RouteParams = Record<string, string>;

type ParsedSegment =
  | { dynamic: true; key: string }
  | { dynamic: false; literal: string };

type ParsedPattern = {
  canonical: string;
  segments: ParsedSegment[];
  locales: { ca: string; en: string; es: string };
  localeSegments: {
    ca: ParsedSegment[];
    en: ParsedSegment[];
    es: ParsedSegment[];
  };
};

function parseSegments(pattern: string): ParsedSegment[] {
  return pattern
    .split("/")
    .filter(Boolean)
    .map((seg): ParsedSegment => {
      const m = seg.match(/^\[(.+?)\]$/);
      return m ? { dynamic: true, key: m[1] } : { dynamic: false, literal: seg };
    });
}

const PARSED_CATALOG: ParsedPattern[] = Object.entries(ROUTE_CATALOG).map(
  ([canonical, locales]) => ({
    canonical,
    segments: parseSegments(canonical),
    locales,
    localeSegments: {
      ca: parseSegments(locales.ca),
      en: parseSegments(locales.en),
      es: parseSegments(locales.es),
    },
  })
);

const PREFIXED_LOCALES = ["en", "es"] as const;

const LOCALE_PREFIX_RE = new RegExp(`^/(${PREFIXED_LOCALES.join("|")})(\/.*)?$`);

function matchPattern(
  pathSegs: string[],
  segments: ParsedSegment[]
): RouteParams | null {
  if (pathSegs.length !== segments.length) return null;

  const params: RouteParams = {};
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.dynamic) {
      params[seg.key] = pathSegs[i];
    } else if (seg.literal !== pathSegs[i]) {
      return null;
    }
  }
  return params;
}

export function buildSphereSlug(sphereId: SphereId, locale: Locale = "en"): string {
  return `${SEGMENT_PREFIXES.sphere[locale]}-${sphereId}`;
}

export function buildGoalSlug(goalId: GoalId, locale: Locale = "en"): string {
  return `${SEGMENT_PREFIXES.goal[locale]}-${goalId}`;
}

export function buildActionSlug(actionId: string, locale: Locale = "en"): string {
  return `${SEGMENT_PREFIXES.action[locale]}-${actionId}`;
}

export function buildCanonicalSpherePath(sphereId: SphereId): string {
  return `/${buildSphereSlug(sphereId, "en")}`;
}

export function buildCanonicalGoalPath(sphereId: SphereId, goalId: GoalId): string {
  return `${buildCanonicalSpherePath(sphereId)}/${buildGoalSlug(goalId, "en")}`;
}

export function buildCanonicalActionId(goalId: GoalId, actionNumber: number | string): string {
  return `${goalId}-${actionNumber}`;
}

export function buildCanonicalActionPath(sphereId: SphereId, goalId: GoalId, actionId: string): string {
  return `${buildCanonicalGoalPath(sphereId, goalId)}/${buildActionSlug(actionId, "en")}`;
}

/** All known prefixes per type, for reverse-lookup. */
const ALL_PREFIXES: { type: "sphere" | "goal" | "action"; prefix: string; locale: Locale }[] = [];
for (const [type, locales] of Object.entries(SEGMENT_PREFIXES)) {
  for (const [locale, prefix] of Object.entries(locales)) {
    ALL_PREFIXES.push({ type: type as "sphere" | "goal" | "action", prefix, locale: locale as Locale });
  }
}
ALL_PREFIXES.sort((a, b) => b.prefix.length - a.prefix.length);

/** Parse a single URL segment to extract its type and ID.
 *  Handles any locale's prefix: "sphere-1", "ambit-1", "ambito-1" → { type: "sphere", id: "1" } */
export function parseSegmentId(segment: string): { type: "sphere" | "goal" | "action"; id: string } | null {
  for (const { type, prefix } of ALL_PREFIXES) {
    if (segment.startsWith(`${prefix}-`)) {
      return { type, id: segment.slice(prefix.length + 1) };
    }
  }
  return null;
}

type ResolvedSphere = { sphereId: SphereId };
type ResolvedGoal = { sphereId: SphereId; goalId: GoalId };
type ResolvedAction = { sphereId: SphereId; goalId: GoalId; actionId: string };
type ResolvedHierarchy =
  | ({ kind: "sphere" } & ResolvedSphere)
  | ({ kind: "goal" } & ResolvedGoal)
  | ({ kind: "action" } & ResolvedAction);

/** Validate sphere slug: correct prefix + ID in valid range. */
export function resolveSphereParams(sphereSlug: string): ResolvedSphere | null {
  const parsed = parseSegmentId(sphereSlug);
  if (!parsed || parsed.type !== "sphere") return null;
  const id = Number(parsed.id);
  if (!(id in SPHERE_GOALS)) return null;
  return { sphereId: id as SphereId };
}

/** Validate sphere + goal slugs: goal must belong to the sphere. */
export function resolveGoalParams(sphereSlug: string, goalSlug: string): ResolvedGoal | null {
  const sphere = resolveSphereParams(sphereSlug);
  if (!sphere) return null;
  const parsed = parseSegmentId(goalSlug);
  if (!parsed || parsed.type !== "goal") return null;
  const goalNum = Number(parsed.id);
  if (!SPHERE_GOALS[sphere.sphereId].includes(goalNum as GoalId)) return null;
  return { ...sphere, goalId: goalNum as GoalId };
}

/** Validate sphere + goal + action slugs: action must belong to the goal. */
export function resolveActionParams(
  sphereSlug: string, goalSlug: string, actionSlug: string
): ResolvedAction | null {
  const goal = resolveGoalParams(sphereSlug, goalSlug);
  if (!goal) return null;
  const parsed = parseSegmentId(actionSlug);
  if (!parsed || parsed.type !== "action") return null;
  const parts = parsed.id.split("-");
  if (parts.length !== 2) return null;
  const [goalPart, actionPart] = parts;
  if (Number(goalPart) !== goal.goalId) return null;
  const actionNum = Number(actionPart);
  if (!Number.isInteger(actionNum) || actionNum < 1 || actionNum > ACTION_COUNTS[goal.goalId]) return null;
  return { ...goal, actionId: parsed.id };
}

export function parseHierarchySlug(slug: string): ResolvedHierarchy | null {
  const parts = slug.split("/").filter(Boolean);

  if (parts.length === 1) {
    const sphere = resolveSphereParams(parts[0]);
    return sphere ? { kind: "sphere", ...sphere } : null;
  }

  if (parts.length === 2) {
    const goal = resolveGoalParams(parts[0], parts[1]);
    return goal ? { kind: "goal", ...goal } : null;
  }

  if (parts.length === 3) {
    const action = resolveActionParams(parts[0], parts[1], parts[2]);
    return action ? { kind: "action", ...action } : null;
  }

  return null;
}

export function shortHierarchyLabel(slug: string, locale: Locale): string | null {
  const t = uiStrings[locale];
  const parsed = parseHierarchySlug(slug);

  if (!parsed) return null;
  if (parsed.kind === "action") {
    return `${t.action} ${parsed.actionId.replace("-", ".")}`;
  }
  if (parsed.kind === "goal") {
    return `${t.goal} ${parsed.goalId}`;
  }
  return `${t.sphere} ${parsed.sphereId}`;
}

function translateSegment(seg: string, fromLocale: Locale, toLocale: Locale): string {
  if (fromLocale === toLocale) return seg;
  for (const prefixes of Object.values(SEGMENT_PREFIXES)) {
    const fromPrefix = prefixes[fromLocale];
    if (seg.startsWith(`${fromPrefix}-`)) {
      const id = seg.slice(fromPrefix.length + 1);
      return `${prefixes[toLocale]}-${id}`;
    }
  }
  return seg;
}

/** Detect locale from raw pathname. CA is pathless default. */
export function detectLocale(pathname: string): Locale {
  const match = pathname.match(/^\/(en|es)(\/|$)/);
  return (match ? match[1] : "ca") as Locale;
}

/** Translate a canonical slug to the locale-specific path and prepend locale prefix. */
export function localizeHref(slug: string, locale: Locale): string {
  const pathSegs = slug.split("/").filter(Boolean);

  for (const parsed of PARSED_CATALOG) {
    const params = matchPattern(pathSegs, parsed.segments);
    if (params !== null) {
      const localePattern = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`[${key}]`, value),
        parsed.locales[locale]
      );
      const localized =
        locale === "ca" ? localePattern : `/${locale}${localePattern}`;
      return localized === "/" ? "/" : localized.replace(/\/$/, "");
    }
  }

  const translated = pathSegs.map(seg => translateSegment(seg, "en", locale));
  const localePath = "/" + translated.join("/");
  const localized = locale === "ca" ? localePath : `/${locale}${localePath}`;
  return localized === "/" ? "/" : localized.replace(/\/$/, "");
}

/** Resolve a localized URL to its canonical form if it matches a registered
 *  route pattern in the given locale. Accepts the raw request pathname (with
 *  or without a locale prefix) — strips `/en` or `/es` internally before
 *  walking `PARSED_CATALOG` against the locale's segment slice. CA is the
 *  pathless default and is never stripped. Returns null on no match. */
export function resolveLocalizedRoute(
  pathname: string,
  locale: Locale
): { canonical: string } | null {
  // Strip locale prefix for EN/ES (mirrors toCanonicalPath's approach).
  const localeMatch = pathname.match(LOCALE_PREFIX_RE);
  const withoutLocale = localeMatch ? localeMatch[2] || "/" : pathname;

  const pathSegs = withoutLocale.split("/").filter(Boolean);
  for (const parsed of PARSED_CATALOG) {
    const params = matchPattern(pathSegs, parsed.localeSegments[locale]);
    if (params !== null) {
      const canonical = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`[${key}]`, value),
        parsed.canonical
      );
      return { canonical };
    }
  }
  return null;
}

/** All known locale-specific hierarchy segment prefixes (ambit, sphere, ambito, etc.).
 *  Built from the existing `ALL_PREFIXES` array so there's one source of truth for
 *  prefix→locale mapping across the module. */
const HIERARCHY_PREFIXES: ReadonlyMap<string, Locale> = new Map(
  ALL_PREFIXES.map(({ prefix, locale }) => [prefix, locale] as const)
);

/** Detect locale from hierarchy segments (ambit-1 → ca, sphere-1 → en, ambito-1 → es). Returns null for non-hierarchy paths. */
export function detectHierarchyLocale(pathname: string): Locale | null {
  const firstSeg = pathname.split("/").filter(Boolean)[0];
  if (!firstSeg) return null;
  const dashIdx = firstSeg.indexOf("-");
  if (dashIdx === -1) return null;
  const prefix = firstSeg.slice(0, dashIdx);
  return HIERARCHY_PREFIXES.get(prefix) ?? null;
}

/** Discriminated union returned by `resolveRoute`. Each kind maps to a specific
 *  proxy action: "localized" → rewriteToInternal with canonical; "hierarchy-ca"
 *  → rewriteToInternal with raw pathname; "hierarchy-redirect" → 301 redirect. */
type RouteResolution =
  | { readonly kind: "localized"; readonly canonical: string; readonly locale: Locale }
  | { readonly kind: "hierarchy-ca"; readonly locale: "ca" }
  | { readonly kind: "hierarchy-redirect"; readonly locale: "en" | "es" };

/** Single entry point for proxy middleware routing. Dispatches a pathname to one
 *  of three handlers or returns null to fall through to intlMiddleware. Callers
 *  pass `locale` explicitly (already computed upstream in the proxy) so this
 *  function stays pure and avoids a redundant `detectLocale` regex call. */
export function resolveRoute(
  pathname: string,
  locale: Locale
): RouteResolution | null {
  // 1. Static + dynamic catalog routes. `resolveLocalizedRoute` uses the caller's
  //    locale to select the right segment slice from PARSED_CATALOG.
  const localized = resolveLocalizedRoute(pathname, locale);
  if (localized) {
    return { kind: "localized", canonical: localized.canonical, locale };
  }

  // 2. Hierarchy routes (sphere/goal/action — literal-prefix-with-numeric-suffix
  //    segments that next-intl's `pathnames` config can't model).
  const hierarchyLocale = detectHierarchyLocale(pathname);
  if (hierarchyLocale === "ca") {
    return { kind: "hierarchy-ca", locale: "ca" };
  }
  if (hierarchyLocale) {
    return { kind: "hierarchy-redirect", locale: hierarchyLocale };
  }

  // 3. Unknown — fall through to intlMiddleware.
  return null;
}

/** Convert a raw URL pathname to its canonical (English) path. */
export function toCanonicalPath(rawPathname: string): string {
  const localeMatch = rawPathname.match(LOCALE_PREFIX_RE);
  const locale = (localeMatch?.[1] ?? "ca") as Locale;
  const withoutLocale = localeMatch ? localeMatch[2] || "/" : rawPathname;

  if (locale === "en") {
    return withoutLocale;
  }

  const pathSegs = withoutLocale.split("/").filter(Boolean);

  for (const parsed of PARSED_CATALOG) {
    const params = matchPattern(pathSegs, parsed.localeSegments[locale]);
    if (params !== null) {
      return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`[${key}]`, value),
        parsed.canonical
      );
    }
  }

  if (pathSegs.length > 0) {
    const canonical = pathSegs.map(seg => translateSegment(seg, locale, "en"));
    return "/" + canonical.join("/");
  }

  return withoutLocale;
}
