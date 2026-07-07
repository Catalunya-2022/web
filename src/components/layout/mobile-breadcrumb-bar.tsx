"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { toCanonicalPath } from "@/lib/path-utils";
import { buildCopyPagePayload } from "@/lib/copy-text-generators";
import { CopyIcon } from "@/components/icons/copy-share-icons";
import {
  CopyPageMenuContent,
  useCopyPageActions,
} from "@/components/content/copy-page-menu";
import { useCopyPageData } from "@/components/content/copy-page-context";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

function MobileCopyButton({ locale }: { locale: Locale }) {
  const { data } = useCopyPageData();
  const t = uiStrings[locale];
  const payload = useMemo(
    () => (data ? buildCopyPagePayload(data) : null),
    [data]
  );
  const {
    copyState,
    copiedMessage,
    canShare,
    handleCopy,
    handleCopyCitation,
    handleShareOrCopyLink,
  } = useCopyPageActions(payload, data?.title ?? "", locale);

  if (!data || !payload) return null;

  const isCopied = copyState === "copied";

  return (
    <div className="ml-auto flex items-center rounded-lg border border-border bg-background text-sm text-muted-foreground">
      <button
        onClick={handleCopy}
        className="flex items-center rounded-l-lg p-1.5 transition-colors hover:text-foreground"
        aria-label={isCopied ? copiedMessage : t.copyPage}
      >
        {isCopied
          ? <Check className="size-4 text-green-600" />
          : <CopyIcon className="size-4 shrink-0" />
        }
      </button>
      <div className="h-4 w-px bg-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center rounded-r-lg p-1.5 transition-colors hover:text-foreground"
            aria-label={t.moreCopyOptions}
          >
            <ChevronDown className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <CopyPageMenuContent
          locale={locale}
          citable={data.citable}
          canShare={canShare}
          chatgptHref={payload.chatgptHref}
          claudeHref={payload.claudeHref}
          onCopy={handleCopy}
          onCopyCitation={handleCopyCitation}
          onShareOrCopyLink={handleShareOrCopyLink}
        />
      </DropdownMenu>
    </div>
  );
}

export function MobileBreadcrumbBar({ locale }: { locale: Locale }) {
  const rawPathname = usePathname();
  const canonical = toCanonicalPath(rawPathname);
  const t = uiStrings[locale];
  const allCrumbs = getBreadcrumbs(canonical, locale);
  const crumbs = allCrumbs.slice(0, -1); // exclude current page

  return (
    <div className="fixed inset-x-0 top-14 z-30 flex items-center gap-2 border-b bg-background/80 px-6 py-2 backdrop-blur-md print:hidden md:hidden">
      <SidebarTrigger toggleLabel={t.toggleSidebar} />
      {crumbs.length > 0 && (
        <nav aria-label={t.breadcrumbNav} className="min-w-0">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            {crumbs.map((crumb, i) => (
              <li key={crumb.slug} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight
                    className="size-3.5 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={crumb.slug}
                  className="truncate transition-colors hover:text-foreground"
                >
                  {crumb.shortTitle ?? crumb.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <MobileCopyButton locale={locale} />
    </div>
  );
}
