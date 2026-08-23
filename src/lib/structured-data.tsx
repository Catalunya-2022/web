import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import { DOCUMENT_DOI_URL, DOCUMENT_TITLE } from "@/lib/citation";
import { DOCUMENT_PUBLICATION_DATE } from "@/lib/data/constants";
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

const ORGANIZATION_LOGO = {
  "@type": "ImageObject",
  url: `${BASE_URL}/icons/icon-512.png`,
  width: 512,
  height: 512,
};

// Stable, locale-independent node ids: the same entity across all pages and
// locales. Never localize them; a per-locale @id would fragment the entity.
const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

// sameAs must list URLs that ARE this organization elsewhere, not works it
// authored (the document DOI belongs on the Article/Dataset schemas).
const ORGANIZATION_SAME_AS = [
  "https://ca.wikipedia.org/wiki/Catalunya_2022",
  "https://www.wikidata.org/wiki/Q141012129",
  "https://github.com/Catalunya-2022",
];

// Creation of the task force (2 June 2020), not the document's publication.
const TASK_FORCE_FOUNDING_DATE = "2020-06-02";

/** Git-derived lastmods are date-only; render them in the same ISO datetime
 *  shape as dateCreated/datePublished (Search Console flags the mismatch). */
function toJsonLdDateTime(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00+02:00`;
}

export function articleSchema(params: {
  title: string;
  description?: string;
  url: string;
  locale: Locale;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.url,
    ...(params.image && { image: params.image }),
    inLanguage: INTL_LOCALE_MAP[params.locale],
    datePublished: `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    ...(params.dateModified && { dateModified: toJsonLdDateTime(params.dateModified) }),
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation: {
      "@type": "CreativeWork",
      "@id": DOCUMENT_DOI_URL,
      name: DOCUMENT_TITLE[params.locale],
    },
    // Author and publisher reference the canonical organization node
    // (organizationSchema) by @id. Consumers merge nodes by @id, so inline
    // assertions here must never contradict the canonical node: same name,
    // no competing url (the full node owns it).
    author: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Catalunya 2022",
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Catalunya 2022",
      logo: ORGANIZATION_LOGO,
    },
  };
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Catalunya 2022",
    alternateName: [
      `Catalunya 2022 - RESET: ${uiStrings[locale].ogTagline}`,
      "Grup de Treball Catalunya 2022",
    ],
    url: BASE_URL,
    description: uiStrings[locale].siteDescription,
    logo: ORGANIZATION_LOGO,
    foundingDate: TASK_FORCE_FOUNDING_DATE,
    parentOrganization: {
      "@type": "Organization",
      name: "Generalitat de Catalunya",
      url: "https://www.gencat.cat/",
    },
    // Keep in sync with the Contact line in public/.well-known/security.txt.
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "general inquiry",
      email: "info@2022.cat",
      availableLanguage: ["Catalan", "English", "Spanish"],
    },
    sameAs: ORGANIZATION_SAME_AS,
  };
}

export function webSiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Catalunya 2022",
    alternateName: `Catalunya 2022 - RESET: ${uiStrings[locale].ogTagline}`,
    url: BASE_URL,
    description: uiStrings[locale].siteDescription,
    inLanguage: INTL_LOCALE_MAP[locale],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function profilePageSchema(params: {
  name: string;
  description?: string;
  url: string;
  memberSlug: string;
  image?: string;
  sameAs?: string[];
  locale: Locale;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    dateModified: params.dateModified
      ? toJsonLdDateTime(params.dateModified)
      : `${DOCUMENT_PUBLICATION_DATE}T00:00:00+02:00`,
    mainEntity: {
      "@type": "Person",
      // One node per person across all three locales; a localized @id would
      // fragment the entity (see the node-id note above ORGANIZATION_ID).
      "@id": `${BASE_URL}/task-force/${params.memberSlug}#person`,
      name: params.name,
      description: params.description,
      url: params.url,
      image: params.image,
      ...(params.sameAs?.length && { sameAs: params.sameAs }),
      memberOf: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Catalunya 2022",
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
    isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID, url: BASE_URL },
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
      "@id": ORGANIZATION_ID,
      name: "Catalunya 2022",
    },
    inLanguage: INTL_LOCALE_MAP[params.locale],
    distribution: (["ca", "en", "es"] as const).flatMap((lang) => [
      { "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: `${BASE_URL}/documents/catalunya-2022-${lang}.pdf`, inLanguage: lang },
      { "@type": "DataDownload", encodingFormat: "application/epub+zip", contentUrl: `${BASE_URL}/documents/catalunya-2022-${lang}.epub`, inLanguage: lang },
      { "@type": "DataDownload", encodingFormat: "text/markdown", contentUrl: `${BASE_URL}/documents/catalunya-2022-${lang}.md`, inLanguage: lang },
    ]),
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
