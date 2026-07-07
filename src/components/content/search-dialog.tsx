"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, Users, FileText, Target, Layers, User, ChevronRight } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { formatUiString, uiStrings } from "@/lib/ui-strings";
import { localizeHref } from "@/lib/path-utils";
import type { Locale } from "@/i18n/routing";
import { normalizeForSearch } from "@/lib/search-normalization";
import type { CorpusStats, SearchDocument } from "@/lib/search-engine";

type SearchDialogProps = {
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope?: SearchDocument["type"][];
  placeholder?: string;
};

export function SearchDialog({ locale, open, onOpenChange, scope, placeholder }: SearchDialogProps) {
  const router = useRouter();
  const t = uiStrings[locale];
  const { query, setQuery, retry, results, isLoading, isError, stats } = useSearch(
    locale,
    scope ? { scope } : undefined
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open, setQuery]);

  const handleSelect = useCallback(
    (slug: string) => {
      onOpenChange(false);
      router.push(localizeHref(slug, locale));
    },
    [router, locale, onOpenChange],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.search}
      description={t.search}
      showCloseButton={false}
      shouldFilter={false}
      loop
      className="sm:max-w-2xl max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:max-w-none max-sm:h-dvh max-sm:border-0"
    >
      <CommandInput
        placeholder={placeholder ?? t.searchPlaceholder}
        value={query}
        onValueChange={setQuery}
        showEsc
        onEsc={() => onOpenChange(false)}
      />

      <CommandList className="max-sm:max-h-[calc(100dvh-4rem)]">
        {isLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t.search}
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-3">
            <div className="rounded-lg border border-dashed bg-background p-4">
              <p className="text-sm font-medium text-foreground">
                {t.searchErrorTitle}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.searchErrorBody}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={retry}
              >
                {t.errorRetry}
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !isError && !query.trim() && stats && (
          <CategoryCards stats={stats} locale={locale} onSelect={handleSelect} scope={scope} />
        )}

        {!isLoading && !isError && query.trim() && results.length === 0 && (
          <CommandEmpty>{t.noResults}</CommandEmpty>
        )}

        {!isError && results.length > 0 && (
          <CommandGroup>
            {results.map((result) => (
              <CommandItem
                key={result.slug}
                value={result.slug}
                onSelect={handleSelect}
                className="group/item flex items-start gap-0 py-2.5 px-3"
              >
                <div className="w-9 shrink-0 pt-[1.125rem]">
                  <ResultIcon type={result.type} />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  {result.breadcrumb && (
                    <p className="text-xs text-muted-foreground truncate">
                      {result.breadcrumb}
                    </p>
                  )}
                  <p className="text-sm font-medium leading-snug">
                    <HighlightedText text={result.title} query={query} />
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    <HighlightedText text={result.snippet} query={query} />
                  </p>
                </div>
                <div className="w-6 shrink-0 flex items-center self-center">
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isError
          ? t.searchErrorTitle
          : query.trim() && results.length > 0
          ? formatUiString(t.resultCount, { n: results.length })
          : query.trim()
            ? t.noResults
            : ""}
      </div>
    </CommandDialog>
  );
}

function CategoryCards({
  stats,
  locale,
  onSelect,
  scope,
}: {
  stats: CorpusStats;
  locale: Locale;
  onSelect: (slug: string) => void;
  scope?: SearchDocument["type"][];
}) {
  const t = uiStrings[locale];

  const allCategories: { label: string; count: number; icon: typeof Globe; slug: string; types: SearchDocument["type"][] }[] = [
    { label: t.spheres, count: stats.spheres, icon: Globe, slug: "/action-plan", types: ["sphere"] },
    { label: t.goals, count: stats.goals, icon: Target, slug: "/action-plan", types: ["goal"] },
    { label: t.actions, count: stats.actions, icon: Layers, slug: "/action-plan", types: ["action"] },
    { label: t.documents, count: stats.documents, icon: FileText, slug: "/introduction", types: ["content", "supplementary"] },
    { label: t.taskForceCategory, count: stats.members, icon: Users, slug: "/task-force", types: ["member"] },
  ];

  const categories = scope
    ? allCategories.filter((cat) => cat.types.some((t) => scope.includes(t)))
    : allCategories;

  return (
    <CommandGroup>
      <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3">
        {categories.map((cat) => (
          <CommandItem
            key={cat.label}
            value={`category-${cat.label}`}
            onSelect={() => onSelect(cat.slug)}
            className="flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors hover:bg-accent data-[selected=true]:bg-accent"
          >
            <cat.icon className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{cat.label}</p>
              <p className="text-xs text-muted-foreground">{cat.count}</p>
            </div>
          </CommandItem>
        ))}
      </div>
    </CommandGroup>
  );
}

const TYPE_ICONS: Record<SearchDocument["type"], typeof Globe> = {
  sphere: Globe,
  goal: Target,
  action: Layers,
  content: FileText,
  supplementary: FileText,
  member: User,
};

function ResultIcon({ type }: { type: SearchDocument["type"] }) {
  const Icon = TYPE_ICONS[type];
  return <Icon className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />;
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  // Match against diacritic-stripped text, but preserve original characters.
  // SAFETY: normalizeForSearch preserves 1:1 character positions for NFC-encoded text
  // (all combining marks in Catalan/Spanish/English are single code units in NFC).
  // If this assumption ever breaks, fall back to unhighlighted text.
  const q = normalizeForSearch(query);
  const stripped = normalizeForSearch(text);
  if (stripped.length !== text.length) return <>{text}</>;
  const parts: { text: string; highlight: boolean }[] = [];
  let lastEnd = 0;
  let pos = stripped.indexOf(q);

  while (pos !== -1) {
    if (pos > lastEnd) parts.push({ text: text.slice(lastEnd, pos), highlight: false });
    parts.push({ text: text.slice(pos, pos + q.length), highlight: true });
    lastEnd = pos + q.length;
    pos = stripped.indexOf(q, lastEnd);
  }

  if (lastEnd < text.length) parts.push({ text: text.slice(lastEnd), highlight: false });
  if (parts.length === 0) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <span key={i} className="font-bold text-primary">{part.text}</span>
        ) : (
          part.text
        ),
      )}
    </>
  );
}
