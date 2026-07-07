import type { Metadata, MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { DOCUMENT_PUBLICATION_DATE } from "@/lib/data/constants";
import { localizeHref } from "@/lib/path-utils";
import { getSupplementaryPageCopy, type SupplementaryPageSlug } from "@/lib/page-registry";
import { uiStrings } from "@/lib/ui-strings";
import { INTL_LOCALE_MAP } from "@/lib/utils";

export const BASE_URL = "https://2022.cat";

/** Map a canonical slug + locale to a relative OG image path (e.g. "og/introduccio.png"). */
export function ogImagePath(slug: string, locale: Locale): string {
  if (slug === "/") {
    return locale === "ca" ? "og/home.png" : `og/${locale}/home.png`;
  }
  const localized = localizeHref(slug, locale);
  return `og${localized}.png`;
}

export function buildOgImageUrl(slug: string, locale: Locale): string {
  return `${BASE_URL}/${ogImagePath(slug, locale)}`;
}

export function getOGLocale(locale: Locale): string {
  return INTL_LOCALE_MAP[locale].replace("-", "_");
}

export function getAlternateOGLocales(locale: Locale): string[] {
  return routing.locales
    .filter((l) => l !== locale)
    .map(getOGLocale);
}

export function buildAbsoluteUrl(slug: string, locale: Locale): string {
  return BASE_URL + localizeHref(slug, locale);
}

// x-default always points to CA (pathless default locale)
export function buildAlternates(
  slug: string,
  currentLocale: Locale
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: buildAbsoluteUrl(slug, currentLocale),
    languages: {
      ca: buildAbsoluteUrl(slug, "ca"),
      en: buildAbsoluteUrl(slug, "en"),
      es: buildAbsoluteUrl(slug, "es"),
      "x-default": buildAbsoluteUrl(slug, "ca"),
    },
  };
}

export function buildOpenGraph(params: {
  title: string;
  description?: string;
  locale: Locale;
  slug: string;
  type?: "website" | "article" | "profile";
}): NonNullable<Metadata["openGraph"]> {
  const { title, description, locale, slug, type = "website" } = params;
  const base = {
    title,
    description,
    url: buildAbsoluteUrl(slug, locale),
    siteName: "Catalunya 2022",
    locale: getOGLocale(locale),
    alternateLocale: getAlternateOGLocales(locale),
    images: [{
      url: buildOgImageUrl(slug, locale),
      width: 1200,
      height: 630,
      type: "image/png" as const,
      alt: title,
    }],
  };

  if (type === "article") {
    return { ...base, type: "article", publishedTime: DOCUMENT_PUBLICATION_DATE };
  }

  if (type === "profile") {
    return { ...base, type: "profile" };
  }

  return { ...base, type: "website" };
}

export function buildTwitter(params: {
  title: string;
  description?: string;
  image?: string;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: params.title,
    description: params.description,
    ...(params.image && { images: [params.image] }),
  };
}

/** Build a typed web app manifest for a given locale. */
export function buildManifest(locale: Locale): MetadataRoute.Manifest {
  const t = uiStrings[locale];
  return {
    name: t.siteDescription,
    short_name: "Catalunya 2022",
    description: t.homeDescription,
    lang: locale,
    dir: "ltr",
    start_url: locale === routing.defaultLocale ? "/" : `/${locale}`,
    scope: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["education", "government", "reference"],
  };
}

/** Shared metadata for supplementary pages (organizations, press, resources, etc.) */
export function supplementaryMetadata(
  slug: SupplementaryPageSlug,
  locale: Locale,
): Metadata {
  const { pageTitle, identifier, metaDescription } = getSupplementaryPageCopy(slug, locale);
  const image = buildOgImageUrl(slug, locale);
  // Enrich short page titles with descriptive subtitle for SEO (25-60 chars)
  const t = uiStrings[locale];
  const suffix = pageTitle !== identifier
    ? identifier
    : slug === "/action-plan"
      ? t.homeOgSubtitle.replaceAll(" · ", ", ")
      : null;
  const metaTitle = suffix ? `${pageTitle}: ${suffix}` : pageTitle;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(slug, locale),
    openGraph: buildOpenGraph({ title: pageTitle, description: metaDescription, locale, slug }),
    twitter: buildTwitter({ title: pageTitle, description: metaDescription, image }),
  };
}
