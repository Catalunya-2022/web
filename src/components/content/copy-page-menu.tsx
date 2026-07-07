"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Link as LinkIcon, Printer, Quote, Share2 } from "lucide-react";
import { useCanShare } from "@/hooks/use-can-share";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { uiStrings } from "@/lib/ui-strings";
import { citeDescription, copyCitationLabel } from "@/lib/citation";
import { localized } from "@/i18n/routing";
import type { CopyPagePayload } from "@/lib/copy-text-generators";
import { CopyIcon, OpenAIIcon, ClaudeIcon } from "@/components/icons/copy-share-icons";
import type { Locale } from "@/i18n/routing";

type CopyState = "idle" | "copying" | "copied";

/**
 * Copy/share state machine and handlers shared by the desktop CopyPageDropdown
 * and the mobile breadcrumb-bar copy button. `payload` may be null while the
 * page data has not been announced yet (mobile context); handlers no-op then.
 */
export function useCopyPageActions(
  payload: CopyPagePayload | null,
  title: string,
  locale: Locale
) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [copiedMessage, setCopiedMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const canShare = useCanShare();
  const t = uiStrings[locale];

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const copyWithFeedback = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(message);
      setCopyState("copied");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopyState("idle"), 2000);
    } catch { /* silent */ }
  }, []);

  const handleCopy = useCallback(() => {
    if (!payload || copyState === "copying") return;
    setCopyState("copying");
    if (timerRef.current) clearTimeout(timerRef.current);
    navigator.clipboard.writeText(payload.markdownText).then(() => {
      setCopiedMessage(t.pageCopied);
      setCopyState("copied");
      timerRef.current = setTimeout(() => setCopyState("idle"), 2000);
    }).catch(() => {
      setCopyState("idle");
    });
  }, [payload, copyState, t.pageCopied]);

  const handleCopyCitation = useCallback(async () => {
    if (!payload) return;
    await copyWithFeedback(payload.citationText, t.citationCopied);
  }, [payload, copyWithFeedback, t.citationCopied]);

  const handleShareOrCopyLink = useCallback(async () => {
    if (!payload) return;
    if (canShare) {
      try { await navigator.share({ title, url: payload.url }); } catch { /* user cancelled */ }
    } else {
      await copyWithFeedback(payload.url, t.linkCopied);
    }
  }, [payload, canShare, title, copyWithFeedback, t.linkCopied]);

  return {
    copyState,
    copiedMessage,
    canShare,
    handleCopy,
    handleCopyCitation,
    handleShareOrCopyLink,
  };
}

/** The dropdown menu shared by the desktop and mobile copy-page buttons. */
export function CopyPageMenuContent({
  locale,
  citable,
  canShare,
  chatgptHref,
  claudeHref,
  onCopy,
  onCopyCitation,
  onShareOrCopyLink,
}: {
  locale: Locale;
  citable: boolean;
  canShare: boolean;
  chatgptHref: string;
  claudeHref: string;
  onCopy: () => void;
  onCopyCitation: () => void;
  onShareOrCopyLink: () => void;
}) {
  const t = uiStrings[locale];

  return (
    <DropdownMenuContent align="end" collisionPadding={8} className="w-72 max-w-[calc(100vw-1rem)] p-1.5">
      <DropdownMenuItem
        onSelect={onCopy}
        className="flex items-center gap-3 rounded-md px-3 py-2.5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          <CopyIcon className="size-4 text-muted-foreground" />
        </span>
        <div>
          <div className="text-[13px] font-medium text-foreground">{t.copyPage}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">
            {t.copyAsMarkdown}
          </div>
        </div>
      </DropdownMenuItem>

      {citable && (
        <DropdownMenuItem
          onSelect={onCopyCitation}
          className="flex items-center gap-3 rounded-md px-3 py-2.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <Quote className="size-4 text-muted-foreground" />
          </span>
          <div>
            <div className="text-[13px] font-medium text-foreground">
              {localized(copyCitationLabel, locale)}
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {localized(citeDescription, locale)}
            </div>
          </div>
        </DropdownMenuItem>
      )}

      <DropdownMenuItem asChild>
        <a
          href={chatgptHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <OpenAIIcon className="size-4 text-muted-foreground" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[13px] font-medium text-foreground">
              {t.openInChatGPT}
              <span className="text-muted-foreground">&#x2197;</span>
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {t.askQuestions}
            </div>
          </div>
        </a>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <a
          href={claudeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <ClaudeIcon className="size-4 text-muted-foreground" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[13px] font-medium text-foreground">
              {t.openInClaude}
              <span className="text-muted-foreground">&#x2197;</span>
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {t.askQuestions}
            </div>
          </div>
        </a>
      </DropdownMenuItem>

      <DropdownMenuItem
        onSelect={onShareOrCopyLink}
        className="flex items-center gap-3 rounded-md px-3 py-2.5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          {canShare
            ? <Share2 className="size-4 text-muted-foreground" />
            : <LinkIcon className="size-4 text-muted-foreground" />
          }
        </span>
        <div>
          <div className="text-[13px] font-medium text-foreground">
            {canShare ? t.share : t.copyLink}
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground">
            {t.copyLinkDescription}
          </div>
        </div>
      </DropdownMenuItem>

      <DropdownMenuItem
        onSelect={() => { setTimeout(() => window.print(), 150); }}
        className="flex items-center gap-3 rounded-md px-3 py-2.5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          <Printer className="size-4 text-muted-foreground" />
        </span>
        <div>
          <div className="text-[13px] font-medium text-foreground">
            {t.printPage}
          </div>
          <div className="text-[11px] leading-tight text-muted-foreground">
            {t.printPageDescription}
          </div>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
