"use client";

import { createContext, useContext, useState } from "react";
import type { Locale } from "@/i18n/routing";

type CopyPageData = {
  title: string;
  slug: string;
  rawContent: string;
  locale: Locale;
  /** Document pages only: enables the citation menu item and copy trailer. */
  citable: boolean;
};

const CopyPageContext = createContext<{
  data: CopyPageData | null;
  setData: (data: CopyPageData | null) => void;
}>({ data: null, setData: () => {} });

export function CopyPageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CopyPageData | null>(null);
  return (
    <CopyPageContext value={{ data, setData }}>
      {children}
    </CopyPageContext>
  );
}

export function useCopyPageData() {
  return useContext(CopyPageContext);
}
