import Link from "next/link";
import { Plug } from "lucide-react";
import { localizeHref } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

export function McpCard({ locale, className }: { locale: Locale; className?: string }) {
  const t = uiStrings[locale];
  return (
    <Link
      href={localizeHref("/mcp", locale)}
      className={`group flex h-full flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent${className ? ` ${className}` : ""}`}
    >
      <div className="flex items-center gap-2">
        <Plug className="size-5 text-primary" />
        <h3 className="text-sm font-medium">{t.mcpCardTitle}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{t.mcpCardDescription}</p>
    </Link>
  );
}
