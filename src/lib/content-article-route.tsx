import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { ContentPage } from "@/components/content/content-page";
import { OrientationCard } from "@/components/content/orientation-card";
import { parseHierarchySlug } from "@/lib/path-utils";
import { loadContent, type ParsedContent } from "@/lib/content";
import { getContentPageMetadata } from "@/lib/content-page-meta";
import {
  buildAbsoluteUrl,
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  buildOgImageUrl,
} from "@/lib/metadata";
import { JsonLd, articleSchema, breadcrumbListSchema } from "@/lib/structured-data";
import { getContentLastModified } from "@/lib/content-dates";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type RenderLoadedArticleContentPageParams = {
  slug: string;
  locale: Locale;
  content: ParsedContent;
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
  content: Pick<ParsedContent, "identifier" | "subtitle" | "body">
): Metadata {
  const { title, description } = getContentPageMetadata(content);

  const image = buildOgImageUrl(slug, locale);
  return {
    title,
    description,
    alternates: buildAlternates(slug, locale, { markdownAlternate: true }),
    openGraph: buildOpenGraph({ title, description, locale, slug, type: "article" }),
    twitter: buildTwitter({ title, description, image }),
  };
}

export async function generateContentArticleMetadata(
  slug: string,
  locale: Locale
): Promise<Metadata> {
  const content = await loadContent(slug, locale);
  return buildArticleMetadata(slug, locale, content);
}

function renderLoadedArticleContentPage({
  slug,
  locale,
  content,
  leadingBreadcrumbs,
  children,
}: RenderLoadedArticleContentPageParams): ReactElement {
  const url = buildAbsoluteUrl(slug, locale);
  const { title, description } = getContentPageMetadata(content);

  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([...leadingBreadcrumbs, { name: title, url }])}
      />
      <JsonLd
        data={articleSchema({
          title,
          description,
          url,
          locale,
          image: buildOgImageUrl(slug, locale),
          dateModified: getContentLastModified(slug),
        })}
      />
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
  locale: Locale
): Promise<ReactElement> {
  return renderArticleContentPage({
    slug,
    locale,
    leadingBreadcrumbs: [getHomeBreadcrumb(locale)],
  });
}
