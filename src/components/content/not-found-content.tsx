"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/icons/brand-logo";
import type { Locale } from "@/i18n/routing";
import { detectLocale, localizeHref, parseSegmentId } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";

const SearchDialog = dynamic(
  () => import("@/components/content/search-dialog").then((m) => m.SearchDialog),
  { ssr: false },
);

export type NotFoundShape = { locale: Locale; hierarchy: boolean };

/**
 * What the 404 page should say for a request path: the language of the URL
 * (pathless Catalan, /en, /es) and whether the path has the sphere, goal or
 * action shape in any language (ambit-1, sphere-1, objetivo-2, accio-2-9).
 * The id must be numeric so /action-plan and /en/action-plans are not
 * mistaken for an action URL.
 */
export function describeNotFoundPath(pathname: string): NotFoundShape {
  const locale = detectLocale(pathname);
  const path = locale === "ca" ? pathname : pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  const first = path.split("/").filter(Boolean)[0];
  const parsed = first ? parseSegmentId(first) : null;
  return { locale, hierarchy: parsed !== null && /^\d+(-\d+)?$/.test(parsed.id) };
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/**
 * Shared body of both not-found boundaries. The root boundary serves virtually
 * every bad URL (dynamicParams is false everywhere) and knows no locale, so it
 * renders in Catalan and this component re-renders in the URL's language once
 * the browser takes over: the server HTML stays complete and Catalan for
 * crawlers, text agents and no-JS clients, while visitors on /en/... and
 * /es/... see their language. The research behind this choice is in
 * docs/audits/2026-10-14-localized-404-audit.md.
 */
export function NotFoundContent({ initialLocale }: { initialLocale: Locale }) {
  // useSyncExternalStore: the hydration render uses the server snapshot (the
  // boundary's locale), then React re-renders with the real pathname, with no
  // hydration mismatch and no setState-in-effect.
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => null,
  );
  const shape = pathname === null ? { locale: initialLocale, hierarchy: false } : describeNotFoundPath(pathname);
  const { locale, hierarchy } = shape;
  const t = uiStrings[locale];
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    const title = t.notFoundHeading;
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    // Next streams the route metadata after hydration and rewrites <title>
    // with the boundary's Catalan title; keep the URL's language until unmount.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [locale, t.notFoundHeading]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <Link href={localizeHref("/", locale)} className="mb-10 flex items-center gap-2" aria-label="Catalunya 2022">
        <BrandLogo />
      </Link>
      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t.notFoundHeading}</h1>
      <p className="mb-8 max-w-md text-base leading-relaxed text-foreground/80">
        {hierarchy ? t.notFoundBodyHierarchy : t.notFoundBody}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setSearchMounted(true);
            setSearchOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="size-4" aria-hidden="true" />
          {t.notFoundSearch}
        </button>
        <Link
          href={localizeHref("/", locale)}
          className="inline-flex items-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {t.goHome}
        </Link>
        <Link
          href={localizeHref("/action-plan", locale)}
          className="inline-flex items-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {t.exploreActionPlan}
        </Link>
      </div>
      {/* Recovery pointers for agents and crawlers that land on a dead URL. */}
      <p className="mt-8 text-xs text-muted-foreground">
        <a href="/sitemap.xml" className="underline underline-offset-2 hover:text-foreground">
          {t.siteMap}
        </a>
        <span aria-hidden="true"> · </span>
        <a
          href={locale === "ca" ? "/llms.txt" : `/${locale}/llms.txt`}
          className="underline underline-offset-2 hover:text-foreground"
        >
          llms.txt
        </a>
      </p>
      {searchMounted && <SearchDialog locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />}
    </main>
  );
}
