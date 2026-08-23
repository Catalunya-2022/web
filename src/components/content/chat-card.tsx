import { MessageSquare, ExternalLink } from "lucide-react";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

export function ChatCard({ href, locale }: { href: string; locale: Locale }) {
  const t = uiStrings[locale];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-primary" />
        <h3 className="text-sm font-medium">{t.openGPTApp}</h3>
        <ExternalLink className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </div>
      <p className="text-xs text-muted-foreground">{t.chatCardDescription}</p>
      <span className="sr-only">{t.opensInNewTab}</span>
    </a>
  );
}
