import type { Metadata } from "next";
import {
  generateContentArticleMetadata,
  STATIC_CONTENT_META_OPTIONS,
  renderStandaloneArticleContentPage,
} from "@/lib/content-article-route";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

const SLUG = "/train-of-prosperity";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRouteLocale(params);
  return generateContentArticleMetadata(SLUG, locale, STATIC_CONTENT_META_OPTIONS);
}

export default async function TrainOfProsperityPage({ params }: Props) {
  const locale = await setResolvedRequestLocale(params);
  return renderStandaloneArticleContentPage(SLUG, locale);
}
