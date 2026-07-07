"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DOCUMENT_TITLE } from "@/lib/citation";
import { localizeHref, parseHierarchySlug, toCanonicalPath } from "@/lib/path-utils";
import { formatUiString, uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

/**
 * Orientation card for visitors who land on a deep document page (sphere,
 * goal, or action) from outside the site without knowing what
 * "Catalunya 2022 - RESET" is: one sentence of context plus links to the
 * overview pages.
 */

// sessionStorage: "deep" when the session's first page was a hierarchy page
// reached from outside the site; "other" in every other case.
const ENTRY_KEY = "c22-session-entry";
// localStorage: visitor dismissed the card — never show again.
const DISMISSED_KEY = "c22-orientation-dismissed";
// localStorage: visitor has seen an overview page — the card served its purpose.
const OVERVIEW_SEEN_KEY = "c22-overview-seen";

function isExternalArrival(): boolean {
  if (!document.referrer) return true;
  try {
    return new URL(document.referrer).origin !== window.location.origin;
  } catch {
    return true;
  }
}

/**
 * Keeps the card out of JS-rendering crawlers (the static HTML never
 * contains it, so plain crawlers are covered already) and out of automated
 * browsers — including Playwright, so e2e tests won't see it either.
 */
function isLikelyBot(): boolean {
  return (
    navigator.webdriver === true ||
    /bot|crawler|spider|headless/i.test(navigator.userAgent)
  );
}

/**
 * Classify the session's entry page once and remember it — idempotent, so
 * the card and the tracker can call it in either order. document.referrer is
 * only trustworthy here on the first page: client navigation never updates it.
 */
function ensureSessionEntry(canonicalPath: string): string {
  let entry = sessionStorage.getItem(ENTRY_KEY);
  if (!entry) {
    const isDeep = parseHierarchySlug(canonicalPath) !== null;
    entry = isDeep && isExternalArrival() ? "deep" : "other";
    sessionStorage.setItem(ENTRY_KEY, entry);
  }
  return entry;
}

function trackEvent(action: "dismiss" | "introduction" | "executive-summary") {
  const w = window as {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  };
  w.plausible?.("Orientation Card", { props: { action } });
}

/**
 * Mounted once in the locale layout, renders nothing: classifies the session
 * entry and records overview-page visits, which permanently retire the card.
 */
export function OrientationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const canonical = toCanonicalPath(pathname);
      ensureSessionEntry(canonical);
      if (canonical === "/introduction" || canonical === "/executive-summary") {
        localStorage.setItem(OVERVIEW_SEEN_KEY, "1");
      }
    } catch {
      /* storage unavailable (private mode) — the card just never shows */
    }
  }, [pathname]);

  return null;
}

/** Render **bold** markdown markers as <strong> tags in JSX */
function renderBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export function OrientationCard({ slug, locale }: { slug: string; locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One frame late on purpose: the decision needs browser storage (so the
    // SSR render stays empty) and must run after OrientationTracker's effect.
    const raf = requestAnimationFrame(() => {
      try {
        setVisible(
          !isLikelyBot() &&
            ensureSessionEntry(toCanonicalPath(window.location.pathname)) === "deep" &&
            !localStorage.getItem(DISMISSED_KEY) &&
            !localStorage.getItem(OVERVIEW_SEEN_KEY)
        );
      } catch {
        /* storage unavailable — keep hidden */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* nothing to persist to */
    }
    trackEvent("dismiss");
  }, []);

  const kind = parseHierarchySlug(slug)?.kind;
  if (!visible || !kind) return null;

  const t = uiStrings[locale];
  const body =
    kind === "action"
      ? t.orientationBodyAction
      : kind === "goal"
        ? t.orientationBodyGoal
        : t.orientationBodySphere;

  return (
    <aside className="relative mt-10 flex items-start gap-3.5 rounded-lg border bg-muted/40 p-4 pr-11 print:hidden">
      {/* Brand mark, kept in sync with src/app/icon.svg */}
      <svg viewBox="0 0 32 32" aria-hidden="true" className="mt-0.5 size-7 shrink-0">
        <rect width="32" height="32" rx="6" fill="#BF1523" />
        <path
          d="M21.5 10.2a8.5 8.5 0 1 0 0 11.6"
          stroke="#fff"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <p className="text-sm text-foreground/80">
        {renderBold(formatUiString(body, { title: DOCUMENT_TITLE[locale] }))}{" "}
        {t.orientationCtaPrefix}{" "}
        <Link
          href={localizeHref("/introduction", locale)}
          className={linkClass}
          onClick={() => trackEvent("introduction")}
        >
          {t.orientationCtaIntro}
        </Link>{" "}
        {t.orientationCtaMiddle}{" "}
        <Link
          href={localizeHref("/executive-summary", locale)}
          className={linkClass}
          onClick={() => trackEvent("executive-summary")}
        >
          {t.orientationCtaSummary}
        </Link>{" "}
        {t.orientationCtaSuffix}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.orientationDismiss}
        title={t.orientationDismiss}
        className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </aside>
  );
}
