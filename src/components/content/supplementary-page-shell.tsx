import type { ReactNode } from "react";
import { NavCards } from "@/components/content/nav-cards";
import { PageHeader } from "@/components/content/page-header";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { PageActionBar } from "@/components/content/page-action-bar";
import { PrintHeader } from "@/components/content/print-header";
import { JsonLd, breadcrumbListSchema } from "@/lib/structured-data";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

type Props = {
  slug: string;
  locale: Locale;
  subtitle: string;
  title: string;
  description: ReactNode;
  rawContent: string;
  children: ReactNode;
};

export function SupplementaryPageShell({
  slug, locale, subtitle, title, description, rawContent, children,
}: Props) {
  const t = uiStrings[locale];
  return (
    <>
      <CopyPageSetter title={title} slug={slug} rawContent={rawContent} locale={locale} />
      <PrintHeader locale={locale} />
      <JsonLd data={breadcrumbListSchema([
        { name: t.home, url: buildAbsoluteUrl("/", locale) },
        { name: title, url: buildAbsoluteUrl(slug, locale) },
      ])} />
      <PageActionBar slug={slug} locale={locale} title={title} rawContent={rawContent} />
      <PageHeader subtitle={subtitle} title={title} description={description} />
      {children}
      <NavCards slug={slug} locale={locale} />
    </>
  );
}
