import { getNextPage, getPrevPage } from "@/lib/navigation-server";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import { localizeHref, shortHierarchyLabel } from "@/lib/path-utils";
import { PrevNextNav } from "@/components/content/prev-next-nav";

export async function NavCards({ slug, locale }: { slug: string; locale: Locale }) {
  const t = uiStrings[locale];
  const [prev, next] = await Promise.all([
    getPrevPage(slug, locale),
    getNextPage(slug, locale),
  ]);

  return (
    <PrevNextNav
      prev={prev ? {
        href: localizeHref(prev.slug, locale),
        label: t.previous,
        title: shortHierarchyLabel(prev.slug, locale) ?? prev.title,
      } : null}
      next={next ? {
        href: localizeHref(next.slug, locale),
        label: t.next,
        title: shortHierarchyLabel(next.slug, locale) ?? next.title,
      } : null}
      ariaLabel={t.pageNavigation}
    />
  );
}
