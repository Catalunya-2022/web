"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import {
  search,
  ensureIndex,
  getCorpusStats,
  type SearchResult,
  type SearchDocument,
  type CorpusStats,
} from "@/lib/search-engine";
import type { Locale } from "@/i18n/routing";

type UseSearchOptions = {
  scope?: SearchDocument["type"][];
  debounceMs?: number;
};

type UseSearchReturn = {
  query: string;
  setQuery: (q: string) => void;
  retry: () => void;
  results: SearchResult[];
  isLoading: boolean;
  isError: boolean;
  stats: CorpusStats | null;
};

const DEFAULT_SEARCH_DEBOUNCE_MS = 150;

export function useSearch(locale: Locale, options?: UseSearchOptions): UseSearchReturn {
  const { scope, debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS } = options ?? {};
  const scopeKey = scope ? scope.join(",") : "";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const generationRef = useRef(0);
  const searchGenRef = useRef(0);
  const [, startTransition] = useTransition();

  // Reset request-scoped state when the index target changes (locale switch
  // or retry). Adjusted during render rather than in the effect so the reset
  // paints together with the change instead of one frame later.
  const indexKey = `${locale}:${retryNonce}`;
  const [prevIndexKey, setPrevIndexKey] = useState(indexKey);
  if (prevIndexKey !== indexKey) {
    setPrevIndexKey(indexKey);
    setIsLoading(true);
    setIsError(false);
    setResults([]);
  }

  useEffect(() => {
    const gen = ++generationRef.current;
    let cancelled = false;

    ensureIndex(locale).then((ready) => {
      if (cancelled || gen !== generationRef.current) return;
      startTransition(() => {
        if (ready) {
          setStats(getCorpusStats(locale));
          setIsLoading(false);
        } else {
          setStats(null);
          setIsError(true);
          setIsLoading(false);
        }
      });
    });

    return () => { cancelled = true; };
  }, [locale, retryNonce]);

  useEffect(() => {
    if (!query.trim()) return;
    const currentGen = ++searchGenRef.current;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const r = await search(query, locale, { scope, limit: 10 });
        if (cancelled || currentGen !== searchGenRef.current) return;
        startTransition(() => {
          setResults(r);
          setIsError(false);
        });
      } catch {
        if (cancelled || currentGen !== searchGenRef.current) return;
        startTransition(() => {
          setResults([]);
          setIsError(true);
        });
      }
    }, debounceMs);

    return () => { clearTimeout(timer); cancelled = true; };
    // `scope` is deliberately represented by `scopeKey` in the deps: callers
    // pass a fresh array literal each render, but only its value matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, locale, scopeKey, debounceMs, retryNonce]);

  const handleSetQuery = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) setResults([]);
  }, []);

  const retry = useCallback(() => {
    setStats(null);
    setIsError(false);
    setIsLoading(true);
    setResults([]);
    setRetryNonce((value) => value + 1);
  }, []);

  return {
    query,
    setQuery: handleSetQuery,
    retry,
    results,
    isLoading,
    isError,
    stats,
  };
}
