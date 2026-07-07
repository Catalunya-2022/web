import { defineRouting } from "next-intl/routing";
import { ROUTE_CATALOG } from "@/lib/route-catalog";

export const routing = defineRouting({
  locales: ["ca", "en", "es"],
  defaultLocale: "ca",
  localePrefix: "as-needed",
  pathnames: ROUTE_CATALOG,
  // Disable next-intl's HTTP Link hreflang header. Its fallback for routes
  // outside the pathnames config (sphere/goal/action hierarchy) emits wrong
  // URLs. Our HTML <link rel="alternate"> tags from metadata.alternates
  // remain correct and are the only signal we need (Google's docs treat HTML
  // and HTTP Link as equivalent). Fixes cross-locale 404s reported in Search
  // Console.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/** A value available in all three locales. Generic — defaults to string. */
export type Trilingual<T = string> = Record<Locale, T>;

/** Resolve a value that may be trilingual or a plain string. */
export function localized(value: Trilingual | string, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}
