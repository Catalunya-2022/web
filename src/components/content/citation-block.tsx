import { CopyButton } from "@/components/content/copy-button";
import { SectionHeader } from "@/components/content/section-header";
import {
  buildCitationText,
  citeLabel,
  citeSectionDescription,
  citeSectionLabel,
  copyCitationLabel,
  licenseNoticePrefix,
  licenseNoticeSuffix,
  DOCUMENT_AUTHOR,
  DOCUMENT_DOI_URL,
  DOCUMENT_TITLE,
} from "@/lib/citation";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { uiStrings } from "@/lib/ui-strings";
import { localized } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

const LINK_CLASS =
  "text-primary underline underline-offset-2 decoration-primary/40 transition-colors hover:decoration-primary";

export function CitationBlock({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const url = buildAbsoluteUrl("/", locale);
  return (
    <section className="mb-16" aria-labelledby="section-citation">
      <SectionHeader
        subtitle={localized(citeSectionLabel, locale)}
        title={localized(citeLabel, locale)}
        id="section-citation"
      >
        <p className="mt-2 text-sm text-muted-foreground">
          {localized(citeSectionDescription, locale)}
        </p>
      </SectionHeader>
      <div className="relative rounded-lg border bg-muted/40 py-3 pl-4 pr-12 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent">
        <p>{DOCUMENT_AUTHOR}.</p>
        <p>
          <cite>{DOCUMENT_TITLE[locale]}.</cite>
        </p>
        {/* Citation text is for copying, not navigating — no live links.
            The DOI is clickable via the Arxiu Permanent card above. */}
        <p className="break-all">
          {url} · DOI: {DOCUMENT_DOI_URL}
        </p>
        <CopyButton
          text={buildCitationText(url, locale)}
          label={localized(copyCitationLabel, locale)}
          copiedLabel={t.citationCopied}
          fullArea
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {localized(licenseNoticePrefix, locale)}{" "}
        <a
          href={`https://creativecommons.org/licenses/by/4.0/deed.${locale}`}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          Creative Commons BY 4.0
          <span className="sr-only"> {t.opensInNewTab}</span>
        </a>{" "}
        {localized(licenseNoticeSuffix, locale)}
      </p>
    </section>
  );
}
