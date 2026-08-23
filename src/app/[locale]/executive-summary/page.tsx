import type { Metadata } from "next";
import {
  generateContentArticleMetadata,
  renderStandaloneArticleContentPage,
} from "@/lib/content-article-route";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

const SLUG = "/executive-summary";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRouteLocale(params);
  return generateContentArticleMetadata(SLUG, locale);
}

export default async function ExecutiveSummaryPage({ params }: Props) {
  const locale = await setResolvedRequestLocale(params);
  return renderStandaloneArticleContentPage(SLUG, locale);
}
