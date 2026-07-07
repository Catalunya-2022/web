"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { uiStrings } from "@/lib/ui-strings";
import { buildCopyPagePayload } from "@/lib/copy-text-generators";
import { CopyIcon } from "@/components/icons/copy-share-icons";
import {
  CopyPageMenuContent,
  useCopyPageActions,
} from "@/components/content/copy-page-menu";
import type { Locale } from "@/i18n/routing";

export function CopyPageDropdown({
  title,
  slug,
  rawContent,
  locale,
  citable = false,
}: {
  title: string;
  slug: string;
  rawContent: string;
  locale: Locale;
  citable?: boolean;
}) {
  const t = uiStrings[locale];
  const payload = useMemo(
    () => buildCopyPagePayload({ title, slug, rawContent, locale, citable }),
    [title, slug, rawContent, locale, citable]
  );
  const {
    copyState,
    copiedMessage,
    canShare,
    handleCopy,
    handleCopyCitation,
    handleShareOrCopyLink,
  } = useCopyPageActions(payload, title, locale);

  const label =
    copyState === "copying"
      ? t.copying
      : copyState === "copied"
        ? copiedMessage
        : t.copyPage;

  return (
    <div className="relative hidden print:hidden md:block">
      <div className="flex items-center rounded-lg border border-border bg-background text-sm text-muted-foreground">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-l-lg py-1.5 pl-3 pr-2 transition-colors hover:text-foreground"
        >
          <CopyIcon className="size-4 shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
        <div className="h-4 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center rounded-r-lg py-1.5 pl-2 pr-2.5 transition-colors hover:text-foreground"
              aria-label={t.moreCopyOptions}
            >
              <ChevronDown className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <CopyPageMenuContent
            locale={locale}
            citable={citable}
            canShare={canShare}
            chatgptHref={payload.chatgptHref}
            claudeHref={payload.claudeHref}
            onCopy={handleCopy}
            onCopyCitation={handleCopyCitation}
            onShareOrCopyLink={handleShareOrCopyLink}
          />
        </DropdownMenu>
      </div>
    </div>
  );
}
