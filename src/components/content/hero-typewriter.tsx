"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { localizeHref } from "@/lib/path-utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uiStrings } from "@/lib/ui-strings";
import type { HeroItem } from "@/lib/data/hero-items";
import { localized } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

type Phase = "typing" | "holding" | "erasing" | "paused";
type HeroTypewriterWindow = Window & {
  __CATALUNYA_FREEZE_HERO__?: boolean;
};

const TYPING_SPEED = 40;
const ERASING_SPEED = 20;
const HOLD_DURATION = 4000;
const PAUSE_DURATION = 500;

function shuffleArray<T>(arr: readonly T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const rmMql = typeof window !== "undefined" ? window.matchMedia(REDUCED_MOTION_QUERY) : null;
function subscribeReducedMotion(cb: () => void) {
  rmMql!.addEventListener("change", cb);
  return () => rmMql!.removeEventListener("change", cb);
}
function getReducedMotionSnapshot() { return rmMql!.matches; }
function getReducedMotionServerSnapshot() { return false; }

export function HeroTypewriter({ items, locale }: { items: HeroItem[]; locale: Locale }) {
  const resolve = useCallback((v: HeroItem["text"]) => localized(v, locale), [locale]);
  const shouldFreeze =
    typeof window !== "undefined" &&
    (window as HeroTypewriterWindow).__CATALUNYA_FREEZE_HERO__ === true;
  const [shuffledItems, setShuffledItems] = useState(items);
  const [index, setIndex] = useState(0);
  const [charCount, setCharCount] = useState(resolve(items[0].text).length);
  const [phase, setPhase] = useState<Phase>("holding");
  const [labelCharCount, setLabelCharCount] = useState(resolve(items[0].label).length);
  const prefersReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
  const [visibilityTick, setVisibilityTick] = useState(0);

  // Shuffle items on mount so returning visitors see a different order.
  // Uses useEffect + rAF (not useState initializer) to avoid hydration mismatch on Link href.
  useEffect(() => {
    if (!shouldFreeze) {
      requestAnimationFrame(() =>
        setShuffledItems([items[0], ...shuffleArray(items.slice(1))]),
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Page Visibility API — trigger effect re-evaluation when tab becomes visible
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setVisibilityTick((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  useEffect(() => {
    // Keep the first hero state fixed during visual snapshot tests.
    if (shouldFreeze) return;

    const currentText = resolve(shuffledItems[index].text);
    let timer: ReturnType<typeof setTimeout>;

    if (prefersReducedMotion) {
      if (phase === "holding") {
        timer = setTimeout(() => setPhase("paused"), HOLD_DURATION);
      } else if (phase === "paused") {
        const next = (index + 1) % shuffledItems.length;
        timer = setTimeout(() => {
          setIndex(next);
          setCharCount(resolve(shuffledItems[next].text).length);
          setLabelCharCount(resolve(shuffledItems[next].label).length);
          setPhase("holding");
        }, PAUSE_DURATION);
      }
      return () => clearTimeout(timer);
    }

    switch (phase) {
      case "typing": {
        if (charCount < currentText.length) {
          timer = setTimeout(() => setCharCount((c) => c + 1), TYPING_SPEED);
        } else {
          timer = setTimeout(() => setPhase("holding"), 0);
        }
        break;
      }
      case "holding": {
        timer = setTimeout(() => setPhase("erasing"), HOLD_DURATION);
        break;
      }
      case "erasing": {
        if (charCount > 0) {
          timer = setTimeout(() => setCharCount((c) => c - 1), ERASING_SPEED);
        } else {
          timer = setTimeout(() => setPhase("paused"), 0);
        }
        break;
      }
      case "paused": {
        const next = (index + 1) % shuffledItems.length;
        timer = setTimeout(() => {
          setIndex(next);
          setCharCount(0);
          setLabelCharCount(0);
          setPhase("typing");
        }, PAUSE_DURATION);
        break;
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charCount, index, shuffledItems, resolve, visibilityTick, prefersReducedMotion, shouldFreeze]);

  useEffect(() => {
    if (shouldFreeze) return;
    if (phase !== "typing" && phase !== "holding") return;
    const label = resolve(shuffledItems[index].label);
    if (labelCharCount >= label.length) return;

    const timer = setTimeout(
      () => setLabelCharCount((c) => c + 1),
      TYPING_SPEED,
    );
    return () => clearTimeout(timer);
  }, [phase, labelCharCount, index, shuffledItems, resolve, shouldFreeze]);

  const currentItem = shuffledItems[index];
  const fullText = resolve(currentItem.text);
  const fullLabel = resolve(currentItem.label);
  const displayedText = fullText.slice(0, charCount);
  const showCursor = phase === "typing" || phase === "holding";
  const labelText = fullLabel.slice(0, labelCharCount);

  // Label fades only near the end of erasing (< 20% text remaining), giving more click time
  const textProgress =
    fullText.length > 0 ? charCount / fullText.length : 0;
  const labelFading =
    phase === "paused" || (phase === "erasing" && textProgress < 0.2);

  // Button is clickable when label is fully typed and not fading
  const labelFullyTyped = labelCharCount >= fullLabel.length;
  const isActive = labelFullyTyped && !labelFading;

  const t = uiStrings[locale];

  return (
    <div>
      <h1 className="min-h-[5.5em] text-4xl leading-tight tracking-tight sm:min-h-[5em] sm:text-5xl md:min-h-[4em] md:text-6xl">
        <span className="font-extrabold">RESET:</span>{" "}
        <span className="font-light">{displayedText}</span>
        {showCursor && (
          <span
            className="ml-0.5 inline-block w-[3px] align-baseline text-primary"
            style={{ animation: "cursor-blink 1.06s step-end infinite" }}
            aria-hidden="true"
          >
            |
          </span>
        )}
      </h1>
      <div className="sr-only" role="status" aria-live="polite">
        {phase === "holding" && `RESET: ${fullText}`}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href={localizeHref("/action-plan", locale)}>
            {t.exploreAllActions}
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className={`gap-1 dark:bg-background ${!isActive ? "pointer-events-none" : ""}`}
        >
          <Link
            href={localizeHref(currentItem.slug, locale)}
            aria-hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
          >
            <span>{t.learnMoreAbout}</span>
            <span
              className={`inline-block w-[5.5rem] text-left transition-opacity duration-300 ${
                labelFading ? "opacity-0" : ""
              }`}
            >
              {labelText}
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
