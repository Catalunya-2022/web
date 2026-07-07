import { BreadcrumbNav } from "@/components/content/breadcrumb-nav";
import { CopyPageDropdown } from "@/components/content/copy-page-dropdown";
import type { Locale } from "@/i18n/routing";

/** Breadcrumb + copy-page action bar rendered above the page header. */
export function PageActionBar({
  slug,
  locale,
  title,
  rawContent,
  citable,
  memberName,
}: {
  slug: string;
  locale: Locale;
  title: string;
  rawContent: string;
  citable?: boolean;
  memberName?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-end gap-4 md:justify-between">
      <BreadcrumbNav slug={slug} locale={locale} memberName={memberName} />
      <CopyPageDropdown
        title={title}
        slug={slug}
        rawContent={rawContent}
        locale={locale}
        citable={citable}
      />
    </div>
  );
}
