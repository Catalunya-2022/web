/** Per-locale path pattern for a single route.
 *  Dynamic segments use next-intl bracket syntax: [member], etc. */
type LocalePatterns = {
  ca: string;
  en: string;
  es: string;
};

/**
 * Single source of truth for all public URL patterns (non-action-plan routes).
 * Keys are canonical next-intl pathname keys (English-style).
 * Both routing.ts and path-utils.ts derive their data from this object.
 *
 * Sphere/goal/action routes are NOT here — they use SEGMENT_PREFIXES below
 * and are handled by path-utils.ts directly (next-intl can't handle partial
 * dynamic segments like "sphere-[id]").
 */
export const ROUTE_CATALOG = {
  "/": { ca: "/", en: "/", es: "/" },
  "/introduction": {
    ca: "/introduccio",
    en: "/introduction",
    es: "/introduccion",
  },
  "/executive-summary": {
    ca: "/resum-executiu",
    en: "/executive-summary",
    es: "/resumen-ejecutivo",
  },
  "/train-of-prosperity": {
    ca: "/tren-de-prosperitat",
    en: "/train-of-prosperity",
    es: "/tren-de-prosperidad",
  },
  "/action-plan": {
    ca: "/pla-accio",
    en: "/action-plan",
    es: "/plan-de-accion",
  },
  "/task-force": {
    ca: "/grup-de-treball",
    en: "/task-force",
    es: "/grupo-de-trabajo",
  },
  "/task-force/[member]": {
    ca: "/grup-de-treball/[member]",
    en: "/task-force/[member]",
    es: "/grupo-de-trabajo/[member]",
  },
  "/organizations": {
    ca: "/organitzacions",
    en: "/organizations",
    es: "/organizaciones",
  },
  "/people-consulted": {
    ca: "/persones-consultades",
    en: "/people-consulted",
    es: "/personas-consultadas",
  },
  "/press": { ca: "/premsa", en: "/press", es: "/prensa" },
  "/resources": { ca: "/recursos", en: "/resources", es: "/recursos" },
  "/mcp": { ca: "/mcp", en: "/mcp", es: "/mcp" },
} satisfies Record<string, LocalePatterns>;

/**
 * Locale-specific prefixes for sphere/goal/action URL segments.
 * Used by path-utils.ts for slug building and translation.
 *
 * Examples:
 *   sphere-1 (EN) → ambit-1 (CA) → ambito-1 (ES)
 *   goal-2 (EN)   → objectiu-2 (CA) → objetivo-2 (ES)
 *   action-2-1 (EN) → accio-2-1 (CA) → accion-2-1 (ES)
 */
export const SEGMENT_PREFIXES = {
  sphere: { ca: "ambit", en: "sphere", es: "ambito" },
  goal: { ca: "objectiu", en: "goal", es: "objetivo" },
  action: { ca: "accio", en: "action", es: "accion" },
} as const;
