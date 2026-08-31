"use client";

import { useEffect, useRef } from "react";
import { useCopyPageData } from "@/components/content/copy-page-context";
import { trackEvent } from "@/lib/analytics";
import type { WebMcpPageData } from "@/lib/webmcp-tools";
import type { Locale } from "@/i18n/routing";

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  return response.text();
}

export function WebMcpTools({ locale }: { locale: Locale }) {
  const { data } = useCopyPageData();
  const pageRef = useRef<WebMcpPageData>(null);

  useEffect(() => {
    pageRef.current = data
      ? { slug: data.slug, title: data.title, rawContent: data.rawContent }
      : null;
  }, [data]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context || typeof context.registerTool !== "function") return;
    const controller = new AbortController();

    (async () => {
      const [{ createWebMcpTools }, engine] = await Promise.all([
        import("@/lib/webmcp-tools"),
        import("@/lib/search-engine"),
      ]);
      if (controller.signal.aborted) return;
      const tools = createWebMcpTools({
        locale,
        getPageData: () => pageRef.current,
        search: engine.search,
        ensureIndex: engine.ensureIndex,
        getCorpusDocuments: engine.getCorpusDocuments,
        fetchText,
        onSuccess: (name) => trackEvent(`WebMCP: ${name}`),
      });
      for (const tool of tools) {
        try {
          await context.registerTool(tool, { signal: controller.signal });
        } catch {
          /* silent */
        }
      }
    })().catch(() => undefined);

    return () => controller.abort();
  }, [locale]);

  return null;
}
