"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { CopyButton } from "@/components/content/copy-button";
import type { McpClientConfig } from "@/lib/data/mcp";
import type { Locale } from "@/i18n/routing";

type Props = {
  configs: McpClientConfig[];
  locale: Locale;
  labels: { copyCommand: string };
};

export function McpClientSetup({ configs, locale, labels }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {configs.map((config) => {
        const isOpen = openId === config.id;

        return (
          <Collapsible
            key={config.id}
            open={isOpen}
            onOpenChange={(open) => setOpenId(open ? config.id : null)}
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent">
              <ChevronRight
                className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              {typeof config.name === "string" ? config.name : config.name[locale]}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2">
              <p className="mb-3 text-sm text-foreground/80">
                {config.instructions[locale]}
              </p>
              <div className="relative">
                <pre className="overflow-x-auto rounded-md bg-muted p-4 pr-10 text-xs leading-relaxed">
                  <code>{config.code}</code>
                </pre>
                <CopyButton
                  text={config.code}
                  label={labels.copyCommand}
                  fullArea
                />
              </div>
              {config.note && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {config.note[locale]}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
