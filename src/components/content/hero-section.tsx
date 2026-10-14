import Link from "next/link";
import { localizeHref } from "@/lib/path-utils";
import { HeroTypewriter } from "@/components/content/hero-typewriter";
import { GradientBadge } from "@/components/content/gradient-badge";
import { AmbientGlow } from "@/components/content/ambient-glow";
import { DownloadCard } from "@/components/content/download-card";
import { ChatCard } from "@/components/content/chat-card";
import { McpCard } from "@/components/content/mcp-card";
import { heroItems } from "@/lib/data/hero-items";
import { documentDownloadPath } from "@/lib/document-downloads";
import { uiStrings } from "@/lib/ui-strings";
import { localized } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

/**
 * Runs during HTML parsing, before React hydrates (the pattern next-themes uses
 * for the colour scheme): picks a random hero item and writes it into the
 * server-rendered markup (item 0), then records the index for HeroTypewriter,
 * whose first client render therefore matches the DOM. Crawlers and no-JS
 * clients keep item 0; the visual tests set the freeze flag and skip it.
 */
const PICK_HERO_ITEM_SCRIPT = `(function(){try{
if(window.__CATALUNYA_FREEZE_HERO__)return;
var s=document.currentScript,items=JSON.parse(s.getAttribute("data-items"));
var r=Math.floor(Math.random()*items.length);if(!r)return;
var it=items[r],h=document.querySelector("[data-hero-heading]"),t=document.querySelector("[data-hero-text]"),l=document.querySelector("[data-hero-label]"),a=document.querySelector("[data-hero-link]");
if(!h||!t||!l||!a)return;
t.textContent=it.text;l.textContent=it.label;a.setAttribute("href",it.href);h.setAttribute("aria-label","RESET: "+it.text);
window.__CATALUNYA_HERO_INDEX__=r;
}catch(e){}})();`;

export function HeroSection({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];

  return (
    <>
      <AmbientGlow />
      <section className="relative z-10 mb-8 print:hidden sm:mb-10">
        <div className="mb-0 hidden sm:block">
          <GradientBadge />
        </div>
        <HeroTypewriter items={heroItems} locale={locale} />
        <script
          data-items={JSON.stringify(
            heroItems.map((item) => ({
              text: localized(item.text, locale),
              label: localized(item.label, locale),
              href: localizeHref(item.slug, locale),
            })),
          )}
          dangerouslySetInnerHTML={{ __html: PICK_HERO_ITEM_SCRIPT }}
        />
      </section>
      <section className="relative z-10 mb-8 print:hidden sm:mb-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.downloadDocument}
            </h2>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <DownloadCard
                title="PDF"
                description={t.pdfDescription}
                href={documentDownloadPath(locale, "pdf")}
              />
              <DownloadCard
                title="ePub"
                description={t.epubDescription}
                href={documentDownloadPath(locale, "epub")}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.chatWithDocument}
            </h2>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <ChatCard href="https://chatgpt.com/g/g-69b11fba75588191b031e6311036a470-catalunya-2022" locale={locale} />
              <McpCard locale={locale} />
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 mb-8 sm:mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          RESET
        </p>
        <h2 className="mt-1 mb-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {t.callToReactivate}
        </h2>
        <div className="grid gap-8 text-[15px] leading-relaxed text-foreground/80 sm:grid-cols-2">
          <p>
            {t.heroContextP1}{" "}
            <a
              href="https://dogc.gencat.cat/ca/document-del-dogc/?documentId=874214"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 decoration-primary/40 transition-colors hover:decoration-primary"
            >
              {t.heroOfficiallyConvened}
              <span className="sr-only"> {t.opensInNewTab}</span>
            </a>{" "}
            {t.heroContextConvened}
          </p>
          <p>
            {t.heroContextP2}{" "}
            <Link
              href={localizeHref("/action-plan", locale)}
              className="text-primary underline underline-offset-2 decoration-primary/40 transition-colors hover:decoration-primary"
            >
              {t.heroNinetyOneActions}
            </Link>{" "}
            {t.heroContextActions}
          </p>
        </div>
      </section>
    </>
  );
}
