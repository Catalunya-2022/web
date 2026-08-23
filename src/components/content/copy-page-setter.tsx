"use client";

import { useEffect } from "react";
import { useCopyPageData } from "@/components/content/copy-page-context";
import type { Locale } from "@/i18n/routing";

export function CopyPageSetter({
  title,
  slug,
  rawContent,
  locale,
  citable = false,
}: {
  title: string;
  slug: string;
  rawContent: string;
  locale: Locale;
  citable?: boolean;
}) {
  const { setData } = useCopyPageData();

  useEffect(() => {
    setData({ title, slug, rawContent, locale, citable });
    return () => setData(null);
  }, [title, slug, rawContent, locale, citable, setData]);

  return null;
}
