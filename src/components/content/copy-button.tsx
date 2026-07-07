"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Clipboard, Check } from "lucide-react";

export function CopyButton({
  text,
  label,
  fullArea,
}: {
  text: string;
  label: string;
  fullArea?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [text]);

  return (
    <>
      <button
        onClick={handleCopy}
        aria-label={label}
        className={
          fullArea
            ? "group/copy absolute inset-0 z-10 flex cursor-pointer items-center justify-end rounded-lg pr-3"
            : "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground opacity-50 transition-all hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
        }
      >
        {copied ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <Clipboard
            className={
              fullArea
                ? "size-3.5 text-muted-foreground opacity-50 transition-opacity group-hover/copy:opacity-100"
                : "size-3.5"
            }
          />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? label : ""}
      </span>
    </>
  );
}
