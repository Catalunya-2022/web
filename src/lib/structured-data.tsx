import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import { DOCUMENT_DOI_URL, DOCUMENT_TITLE } from "@/lib/citation";
import { DOCUMENT_PUBLICATION_DATE } from "@/lib/data/constants";
import { localizeHref } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import { INTL_LOCALE_MAP } from "@/lib/utils";
import { BASE_URL } from "@/lib/metadata";

export function breadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(params: {
  title: string;
  description?: string;
  url: string;
  locale: Locale;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.url,
    inLanguage: INTL_LOCALE_MAP[params.locale],
    datePublished: params.datePublished ?? `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation: {
      "@type": "CreativeWork",
      "@id": DOCUMENT_DOI_URL,
      name: DOCUMENT_TITLE[params.locale],
    },
    author: {
      "@type": "Organization",
      name: "Grup de Treball Catalunya 2022",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Catalunya 2022",
      url: BASE_URL,
    },
  };
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Catalunya 2022",
    alternateName: `Catalunya 2022 - RESET: ${uiStrings[locale].ogTagline}`,
    url: BASE_URL,
    description: uiStrings[locale].siteDescription,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icons/icon-512.png`,
      width: 512,
      height: 512,
    },
    // sameAs is deliberately absent: it must list URLs that ARE this
    // organization elsewhere — not works it authored (the document DOI
    // belongs on the Article/Dataset schemas). Add Wikipedia + Wikidata
    // here once the Wikipedia article exists.
  };
}

export function webSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Catalunya 2022",
    alternateName: `Catalunya 2022 - RESET: ${uiStrings[locale].ogTagline}`,
    url: BASE_URL,
    description: uiStrings[locale].siteDescription,
    inLanguage: INTL_LOCALE_MAP[locale],
  };
}

export function profilePageSchema(params: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  sameAs?: string[];
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    dateModified: `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    mainEntity: {
      "@type": "Person",
      name: params.name,
      description: params.description,
      url: params.url,
      image: params.image,
      ...(params.sameAs?.length && { sameAs: params.sameAs }),
      memberOf: {
        "@type": "Organization",
        name: "Grup de Treball Catalunya 2022",
        url: `${BASE_URL}${localizeHref("/task-force", params.locale)}`,
      },
    },
  };
}

export function videoSchema(params: {
  name: string;
  description: string;
  videoId: string;
  uploadDate: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: params.name,
    description: params.description,
    thumbnailUrl: `https://img.youtube.com/vi/${params.videoId}/maxresdefault.jpg`,
    uploadDate: params.uploadDate,
    embedUrl: `https://www.youtube-nocookie.com/embed/${params.videoId}`,
    inLanguage: INTL_LOCALE_MAP[params.locale],
  };
}

export function softwareApplicationSchema(params: {
  name: string;
  description: string;
  url: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: params.name,
    description: params.description,
    url: params.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    inLanguage: INTL_LOCALE_MAP[params.locale],
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    isPartOf: { "@type": "WebSite", url: BASE_URL },
  };
}

export function datasetSchema(params: {
  name: string;
  description: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: params.name,
    description: params.description,
    url: DOCUMENT_DOI_URL,
    identifier: DOCUMENT_DOI_URL,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "Grup de Treball Catalunya 2022",
      url: `${BASE_URL}${localizeHref("/task-force", params.locale)}`,
    },
    inLanguage: INTL_LOCALE_MAP[params.locale],
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: `${BASE_URL}/documents/catalunya-2022-ca.pdf`, inLanguage: "ca" },
      { "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: `${BASE_URL}/documents/catalunya-2022-en.pdf`, inLanguage: "en" },
      { "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: `${BASE_URL}/documents/catalunya-2022-es.pdf`, inLanguage: "es" },
    ],
  };
}

export function JsonLd({ data }: { data: object }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
