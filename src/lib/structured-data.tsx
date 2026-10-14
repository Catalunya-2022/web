import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import { DOCUMENT_DOI_URL, DOCUMENT_TITLE } from "@/lib/citation";
import { DOCUMENT_PUBLICATION_DATE } from "@/lib/data/constants";
import { getMemberBySlug } from "@/lib/data/team-members";
import { uiStrings } from "@/lib/ui-strings";
import { INTL_LOCALE_MAP } from "@/lib/utils";
import { BASE_URL } from "@/lib/metadata";
import { localizeHref } from "@/lib/path-utils";
import { documentDownloadUrl } from "@/lib/document-downloads";

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

const MADRID_OFFSET_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Madrid",
  timeZoneName: "longOffset",
});

function madridOffset(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const zone =
    MADRID_OFFSET_FORMAT.formatToParts(new Date(Date.UTC(year, month - 1, day))).find(
      (part) => part.type === "timeZoneName"
    )?.value ?? "GMT+01:00";
  return zone === "GMT" ? "+00:00" : zone.slice(3);
}

/** Git-derived lastmods are date-only; render them in the same ISO datetime
 *  shape as dateCreated/datePublished (Search Console flags the mismatch). */
function toJsonLdDateTime(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00${madridOffset(date)}`;
}

const PUBLICATION_DATETIME = toJsonLdDateTime(DOCUMENT_PUBLICATION_DATE);

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
    datePublished: PUBLICATION_DATETIME,
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
  const jobTitle = getMemberBySlug(params.memberSlug)?.role[params.locale];

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: params.url,
    dateCreated: PUBLICATION_DATETIME,
    dateModified: params.dateModified
      ? toJsonLdDateTime(params.dateModified)
      : PUBLICATION_DATETIME,
    mainEntity: {
      "@type": "Person",
      // One node per person across all three locales; a per-locale @id would
      // fragment the entity (see the node-id note above ORGANIZATION_ID). The
      // Catalan profile URL is the stable base: Google crawls node ids as
      // URLs, and this one resolves with 200 where the locale-less English
      // form only redirected (Search Console review, 2026-10-14).
      "@id": `${BASE_URL}${localizeHref(`/task-force/${params.memberSlug}`, "ca")}#person`,
      name: params.name,
      ...(jobTitle && { jobTitle }),
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
      { "@type": "DataDownload", encodingFormat: "application/pdf", contentUrl: documentDownloadUrl(lang, "pdf"), inLanguage: lang },
      { "@type": "DataDownload", encodingFormat: "application/epub+zip", contentUrl: documentDownloadUrl(lang, "epub"), inLanguage: lang },
      { "@type": "DataDownload", encodingFormat: "text/markdown", contentUrl: documentDownloadUrl(lang, "md"), inLanguage: lang },
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
