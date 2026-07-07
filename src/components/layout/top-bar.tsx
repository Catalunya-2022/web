"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Search } from "lucide-react";
import { BrandLogo } from "@/components/icons/brand-logo";
import { localizeHref } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import { isEditableTarget } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const SearchDialog = dynamic(
  () => import("@/components/content/search-dialog").then((m) => m.SearchDialog),
  { ssr: false },
);

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

export function TopBar({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState<boolean | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setIsMac(
        /mac|iphone|ipad|ipod/i.test(
          (navigator as NavigatorWithUserAgentData).userAgentData?.platform ??
            navigator.platform
        )
      )
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "k" &&
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        !isEditableTarget(e.target)
      ) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 print:hidden">
        <div className="flex items-center gap-2">
          <Link href={localizeHref("/", locale)} className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </div>

        {(() => {
          const searchTriggerProps = {
            onClick: () => setSearchOpen(true),
            onMouseEnter: () => {
              import("@/lib/search-engine").then((m) => m.preloadCorpus(locale));
              import("@/components/content/search-dialog");
            },
            onFocus: () => import("@/lib/search-engine").then((m) => m.preloadCorpus(locale)),
          };
          return (
            <>
              <button
                {...searchTriggerProps}
                className="hidden md:flex h-8 w-72 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-[border-color] hover:border-muted-foreground/40"
              >
                <Search className="size-4 shrink-0" />
                <span>{t.search}</span>
                {isMac !== null && (
                  <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {isMac ? <><span className="text-xs">⌘</span>K</> : "Ctrl K"}
                  </kbd>
                )}
              </button>
              <button
                {...searchTriggerProps}
                aria-label={t.search}
                className="flex md:hidden size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <Search className="size-5" />
              </button>
            </>
          );
        })()}
      </header>

      <SearchDialog locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
