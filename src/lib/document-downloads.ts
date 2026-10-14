import type { Locale } from "@/i18n/routing";
import { BASE_URL } from "@/lib/metadata";

export const DOCUMENT_FORMATS = ["pdf", "epub", "md"] as const;

export type DocumentFormat = (typeof DOCUMENT_FORMATS)[number];

export function documentDownloadPath(locale: Locale, format: DocumentFormat): string {
  return `/documents/catalunya-2022-${locale}.${format}`;
}

export function documentDownloadUrl(locale: Locale, format: DocumentFormat): string {
  return `${BASE_URL}${documentDownloadPath(locale, format)}`;
}
