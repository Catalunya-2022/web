import type { ReactNode } from "react";
import { NavCards } from "@/components/content/nav-cards";
import { PageHeader } from "@/components/content/page-header";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { PageActionBar } from "@/components/content/page-action-bar";
import { PrintHeader } from "@/components/content/print-header";
import { JsonLd, breadcrumbListSchema } from "@/lib/structured-data";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { getSupplementaryPageCopy, type SupplementaryPageSlug } from "@/lib/page-registry";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

type Props = {
  slug: SupplementaryPageSlug;
  locale: Locale;
  /** Rich override for pages whose description embeds markup (links). */
  description?: ReactNode;
  rawContent: string;
  children: ReactNode;
};

export function SupplementaryPageShell({
  slug, locale, description, rawContent, children,
}: Props) {
  const t = uiStrings[locale];
  // The registry owns each page's identifier/title/description; pages no
  // longer re-pass the same uiStrings the registry already resolves.
  const copy = getSupplementaryPageCopy(slug, locale);
  const subtitle = copy.identifier;
  const title = copy.title;
  const resolvedDescription = description ?? copy.description;
  return (
    <>
      <CopyPageSetter title={title} slug={slug} rawContent={rawContent} locale={locale} />
      <PrintHeader locale={locale} />
      <JsonLd data={breadcrumbListSchema([
        { name: t.home, url: buildAbsoluteUrl("/", locale) },
        { name: title, url: buildAbsoluteUrl(slug, locale) },
      ])} />
      <PageActionBar slug={slug} locale={locale} title={title} rawContent={rawContent} />
      <PageHeader subtitle={subtitle} title={title} description={resolvedDescription} />
      {children}
      <NavCards slug={slug} locale={locale} />
    </>
  );
}
