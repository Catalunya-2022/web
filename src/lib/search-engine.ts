/**
 * Client-side search engine powered by flexsearch.
 * Lazy-loads per-locale corpus JSON, builds index on first use.
 */

import { Document, Charset } from "flexsearch";
import { normalizeForSearch } from "@/lib/search-normalization";
import type { Locale } from "@/i18n/routing";

export type SearchDocument = {
  slug: string;
  type: "sphere" | "goal" | "action" | "content" | "member" | "supplementary";
  identifier: string;
  title: string;
  breadcrumb: string;
  body: string;
};

export type SearchResult = SearchDocument & {
  snippet: string;
};

export type CorpusStats = {
  spheres: number;
  goals: number;
  actions: number;
  documents: number;
  members: number;
};

type SearchOptions = {
  scope?: SearchDocument["type"][];
  limit?: number;
};

const MAX_SEARCH_QUERY_LENGTH = 100;
const DEFAULT_SNIPPET_WINDOW = 120;

let cache: {
  locale: Locale;
  corpus: SearchDocument[];
  index: Document<SearchDocument>;
  stats: CorpusStats;
} | null = null;

let buildGeneration = 0;
let requestedLocale: Locale | null = null;
let currentAbortController: AbortController | null = null;
const inflightPromises = new Map<Locale, Promise<boolean>>();

export async function ensureIndex(locale: Locale): Promise<boolean> {
  requestedLocale = locale;
  if (cache?.locale === locale) return true;

  const existing = inflightPromises.get(locale);
  if (existing) return existing;

  // Abort any in-flight fetch for a different locale
  currentAbortController?.abort();
  const controller = new AbortController();
  currentAbortController = controller;

  const gen = ++buildGeneration;
  const promise = (async () => {
    try {
      const res = await fetch(`/search-corpus-${locale}.json`, {
        signal: controller.signal,
      });
      if (!res.ok || gen !== buildGeneration) return false;
      const corpus: SearchDocument[] = await res.json();
      if (gen !== buildGeneration) return false;

      const index = new Document<SearchDocument>({
        document: {
          id: "slug",
          index: [
            { field: "identifier", tokenize: "forward", encoder: Charset.LatinBalance },
            { field: "title", tokenize: "forward", encoder: Charset.LatinBalance },
            { field: "body", tokenize: "forward", encoder: Charset.LatinBalance },
          ],
          tag: [{ field: "type" }],
          store: true,
        },
      });

      const stats: CorpusStats = { spheres: 0, goals: 0, actions: 0, documents: 0, members: 0 };
      for (const doc of corpus) {
        index.add(doc);
        switch (doc.type) {
          case "sphere": stats.spheres++; break;
          case "goal": stats.goals++; break;
          case "action": stats.actions++; break;
          case "content":
          case "supplementary": stats.documents++; break;
          case "member": stats.members++; break;
        }
      }

      // Guard: skip cache write if a different locale was requested since this fetch started
      if (gen !== buildGeneration || requestedLocale !== locale) return false;
      cache = { locale, index, corpus, stats };
      return true;
    } catch {
      return false; // Handles AbortError and network errors
    }
  })();

  inflightPromises.set(locale, promise);
  promise.finally(() => {
    // Only delete if this is still OUR promise (ABA race guard)
    if (inflightPromises.get(locale) === promise) {
      inflightPromises.delete(locale);
    }
    if (currentAbortController === controller) {
      currentAbortController = null;
    }
  });
  return promise;
}

/** Pre-warm: start fetching corpus without blocking. */
export function preloadCorpus(locale: Locale): void {
  if (cache?.locale === locale) return;
  ensureIndex(locale);
}

/** Flexsearch enriched result shape (flexsearch v0.8 types are incomplete). */
type FlexSearchResult = Array<{
  field: string;
  result: Array<{ id: string; doc: SearchDocument }>;
}>;

type FlexSearchOpts = {
  enrich: true;
  limit: number;
  tag?: { type: SearchDocument["type"][] };
};

/** Typed wrapper around flexsearch Document.search().
 *  Contains the `as any` cast at a single boundary point. */
function searchIndex(
  index: Document<SearchDocument>,
  query: string,
  opts: FlexSearchOpts,
): FlexSearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return index.search(query, opts as any) as any as FlexSearchResult;
}

/** Search the index. Throws if the locale index can't be loaded. */
export async function search(
  query: string,
  locale: Locale,
  options?: SearchOptions,
): Promise<SearchResult[]> {
  const ready = await ensureIndex(locale);
  if (!ready || !cache || cache.locale !== locale) {
    throw new Error(`Search index for locale "${locale}" is unavailable`);
  }

  const trimmed = query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH);
  if (!trimmed) return [];

  // Normalize diacritics so "mon rural" matches "món rural"
  const normalized = normalizeForSearch(trimmed);

  const limit = options?.limit ?? 10;

  const searchOpts: FlexSearchOpts = { enrich: true, limit };
  if (options?.scope?.length) {
    searchOpts.tag = { type: options.scope };
  }

  const raw = searchIndex(cache.index, trimmed, searchOpts);

  let rawNorm: FlexSearchResult = [];
  if (normalized !== trimmed) {
    rawNorm = searchIndex(cache.index, normalized, searchOpts);
  }

  const seen = new Set<string>();
  const results: SearchResult[] = [];

  for (const fieldResult of [...raw, ...rawNorm]) {
    for (const item of fieldResult.result) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      results.push({
        ...item.doc,
        snippet: extractSnippet(item.doc.body, trimmed),
      });
    }
  }

  const q = normalizeForSearch(trimmed);
  const ranked = results.map((r) => ({
    ...r,
    _titleMatch:
      normalizeForSearch(r.title).includes(q) ||
      normalizeForSearch(r.identifier).includes(q),
  }));
  ranked.sort((a, b) => (a._titleMatch ? 0 : 1) - (b._titleMatch ? 0 : 1));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return ranked.map(({ _titleMatch, ...r }) => r).slice(0, limit);
}

/** Get category counts from the cached corpus. */
export function getCorpusStats(locale: Locale): CorpusStats | null {
  if (cache?.locale !== locale) return null;
  return cache.stats;
}

function extractSnippet(
  body: string,
  query: string,
  windowSize = DEFAULT_SNIPPET_WINDOW
): string {
  const lower = normalizeForSearch(body);
  const pos = lower.indexOf(normalizeForSearch(query));
  if (pos === -1) return body.slice(0, windowSize) + (body.length > windowSize ? "..." : "");
  const start = Math.max(0, pos - Math.floor(windowSize / 2));
  const end = Math.min(body.length, pos + query.length + Math.floor(windowSize / 2));
  let snippet = body.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < body.length) snippet += "...";
  return snippet;
}
