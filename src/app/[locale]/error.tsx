"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { detectLocale } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    } else if (error.digest) {
      console.error("Error digest:", error.digest);
    } else {
      console.error("Unexpected client error");
    }
  }, [error]);

  const locale = detectLocale(usePathname());
  const t = uiStrings[locale];

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-semibold">{t.errorHeading}</h2>
      <p className="text-sm text-muted-foreground">
        {t.errorBody}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        {t.errorRetry}
      </button>
    </div>
  );
}
