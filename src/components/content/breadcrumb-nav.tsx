import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export function BreadcrumbNav({ slug, locale, memberName }: { slug: string; locale: Locale; memberName?: string }) {
  const t = uiStrings[locale];
  const allCrumbs = getBreadcrumbs(slug, locale, memberName);
  const crumbs = allCrumbs.slice(0, -1);

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb className="hidden md:block" aria-label={t.breadcrumbNav}>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.slug}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={crumb.slug}>{crumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
