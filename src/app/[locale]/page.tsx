import type { Metadata } from "next";
import { HeroSection } from "@/components/content/hero-section";
import { NavCards } from "@/components/content/nav-cards";
import { PrintHeader } from "@/components/content/print-header";
import { buildAlternates, buildOpenGraph, buildTwitter, buildOgImageUrl } from "@/lib/metadata";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";
import { JsonLd, organizationSchema, webSiteSchema } from "@/lib/structured-data";
import { uiStrings } from "@/lib/ui-strings";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  const t = uiStrings[l];
  const ogTitle = `RESET: ${t.ogTagline}`;
  const description = t.homeDescription;
  return {
    title: { absolute: ogTitle },
    description,
    alternates: buildAlternates("/", l),
    openGraph: buildOpenGraph({ title: ogTitle, description, locale: l, slug: "/", type: "website" }),
    twitter: buildTwitter({ title: ogTitle, description, image: buildOgImageUrl("/", l) }),
  };
}

export default async function Home({ params }: Props) {
  const l = await setResolvedRequestLocale(params);

  return (
    <>
      <JsonLd data={organizationSchema(l)} />
      <JsonLd data={webSiteSchema(l)} />
      <PrintHeader locale={l} />
      <HeroSection locale={l} />
      <NavCards slug="/" locale={l} />
    </>
  );
}
