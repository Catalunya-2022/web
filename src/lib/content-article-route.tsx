import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { ContentPage } from "@/components/content/content-page";
import { OrientationCard } from "@/components/content/orientation-card";
import { parseHierarchySlug } from "@/lib/path-utils";
import { loadContent, type ParsedContent } from "@/lib/content";
import {
  getContentPageMetadata,
  type ContentPageMetaOptions,
} from "@/lib/content-page-meta";
import {
  buildAbsoluteUrl,
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  buildOgImageUrl,
} from "@/lib/metadata";
import { JsonLd, articleSchema, breadcrumbListSchema } from "@/lib/structured-data";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export const HIERARCHY_META_OPTIONS = {
  title: "identifier-with-subtitle",
  description: "first-paragraph",
} satisfies ContentPageMetaOptions;

export const STATIC_CONTENT_META_OPTIONS = {
  title: "identifier-with-subtitle",
  description: "first-paragraph",
  maxTitleLength: Infinity,
} satisfies ContentPageMetaOptions;

type RenderLoadedArticleContentPageParams = {
  slug: string;
  locale: Locale;
  content: ParsedContent;
  metaOptions?: ContentPageMetaOptions;
  leadingBreadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
};

export function getHomeBreadcrumb(locale: Locale): BreadcrumbItem {
  return {
    name: uiStrings[locale].home,
    url: buildAbsoluteUrl("/", locale),
  };
}

function buildArticleMetadata(
  slug: string,
  locale: Locale,
  content: Pick<ParsedContent, "identifier" | "subtitle" | "body">,
  metaOptions?: ContentPageMetaOptions
): Metadata {
  const { title, description } = getContentPageMetadata(content, metaOptions);

  const image = buildOgImageUrl(slug, locale);
  return {
    title,
    description,
    alternates: buildAlternates(slug, locale),
    openGraph: buildOpenGraph({ title, description, locale, slug, type: "article" }),
    twitter: buildTwitter({ title, description, image }),
  };
}

export async function generateContentArticleMetadata(
  slug: string,
  locale: Locale,
  metaOptions?: ContentPageMetaOptions
): Promise<Metadata> {
  const content = await loadContent(slug, locale);
  return buildArticleMetadata(slug, locale, content, metaOptions);
}

function renderLoadedArticleContentPage({
  slug,
  locale,
  content,
  metaOptions,
  leadingBreadcrumbs,
  children,
}: RenderLoadedArticleContentPageParams): ReactElement {
  const url = buildAbsoluteUrl(slug, locale);
  const { title, description } = getContentPageMetadata(content, metaOptions);

  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([...leadingBreadcrumbs, { name: title, url }])}
      />
      <JsonLd data={articleSchema({ title, description, url, locale })} />
      <ContentPage slug={slug} locale={locale} content={content}>
        {children}
        {parseHierarchySlug(slug) && <OrientationCard slug={slug} locale={locale} />}
      </ContentPage>
    </>
  );
}

export async function renderArticleContentPage(
  params: Omit<RenderLoadedArticleContentPageParams, "content">
): Promise<ReactElement> {
  const content = await loadContent(params.slug, params.locale);
  return renderLoadedArticleContentPage({ ...params, content });
}

export async function renderStandaloneArticleContentPage(
  slug: string,
  locale: Locale,
  metaOptions?: ContentPageMetaOptions
): Promise<ReactElement> {
  return renderArticleContentPage({
    slug,
    locale,
    metaOptions,
    leadingBreadcrumbs: [getHomeBreadcrumb(locale)],
  });
}
