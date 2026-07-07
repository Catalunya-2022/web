"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

const SearchDialog = dynamic(
  () => import("@/components/content/search-dialog").then((m) => m.SearchDialog),
  { ssr: false },
);

export function ActionPlanSearch({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = uiStrings[locale];

  return (
    <>
      <button
        className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-[border-color] hover:border-muted-foreground/40 print:hidden"
        onClick={() => setOpen(true)}
        onMouseEnter={() => {
          import("@/lib/search-engine").then((m) => m.preloadCorpus(locale));
          import("@/components/content/search-dialog");
        }}
        onFocus={() => import("@/lib/search-engine").then((m) => m.preloadCorpus(locale))}
        aria-label={t.searchGoalsActions}
      >
        <Search className="size-4 shrink-0" />
        <span>{t.searchGoalsActions}</span>
      </button>
      <SearchDialog
        locale={locale}
        open={open}
        onOpenChange={setOpen}
        scope={["sphere", "goal", "action"]}
        placeholder={t.searchGoalsActions}
      />
    </>
  );
}
