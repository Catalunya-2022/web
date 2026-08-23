import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "@/i18n/routing"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const INTL_LOCALE_MAP: Record<Locale, string> = {
  ca: "ca-ES",
  en: "en-US",
  es: "es-ES",
};

/** True when a keyboard event targets a form field or editable region, so
 *  global shortcuts (Cmd+K, Cmd+B) should not fire. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  return target.closest(
    'input, textarea, select, [contenteditable=""], [contenteditable="true"]'
  ) !== null;
}

export function formatDate(iso: string, locale: Locale = "ca"): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(
    INTL_LOCALE_MAP[locale],
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}
