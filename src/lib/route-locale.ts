import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { assertValidLocale } from "@/lib/content-utils";

type ResolvedRouteParams<T extends { locale: string }> =
  Omit<T, "locale"> & { locale: Locale };

/** Use when a route needs the validated locale plus the rest of the route params. */
export async function resolveRouteParams<T extends { locale: string }>(
  params: Promise<T>
): Promise<ResolvedRouteParams<T>> {
  const { locale, ...rest } = await params;
  assertValidLocale(locale);
  return { ...rest, locale };
}

/** Use in page default exports when route params are needed and next-intl request locale must be set. */
export async function setResolvedRequestParams<T extends { locale: string }>(
  params: Promise<T>
): Promise<ResolvedRouteParams<T>> {
  const resolved = await resolveRouteParams(params);
  setRequestLocale(resolved.locale);
  return resolved;
}

/** Use in `generateMetadata` when only the validated locale is needed. */
export async function resolveRouteLocale<T extends { locale: string }>(
  params: Promise<T>
): Promise<Locale> {
  return (await resolveRouteParams(params)).locale;
}

/** Use in page default exports when only the validated locale is needed. */
export async function setResolvedRequestLocale<T extends { locale: string }>(
  params: Promise<T>
): Promise<Locale> {
  const locale = await resolveRouteLocale(params);
  setRequestLocale(locale);
  return locale;
}

/** Use in files without route params, such as `not-found.tsx`, to read the current request locale. */
export async function getCurrentLocale(): Promise<Locale> {
  const locale = await getLocale();
  assertValidLocale(locale);
  return locale;
}
