import {
  Archive,
  ExternalLink,
  FileDown,
  BookOpen,
  Presentation,
  Scale,
  Github,
  Server,
  BarChart3,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { localizeHref } from "@/lib/path-utils";
import type { ResourceItem, ResourceIconName } from "@/lib/data/resources";
import { localized } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";

const RESOURCE_ICONS = {
  "file-down": FileDown,
  "book-open": BookOpen,
  "presentation": Presentation,
  "scale": Scale,
  "github": Github,
  "server": Server,
  "bar-chart-3": BarChart3,
  "message-circle": MessageCircle,
  "archive": Archive,
} as const satisfies Record<ResourceIconName, LucideIcon>;

export function ResourceCard({ item, locale }: { item: ResourceItem; locale: Locale }) {
  const Icon = RESOURCE_ICONS[item.icon];
  const t = uiStrings[locale];
  const title = localized(item.title, locale);
  const description = localized(item.description, locale);
  const disabledReason = item.disabledReason ? localized(item.disabledReason, locale) : undefined;

  if (item.disabled) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-dashed p-5 opacity-60">
        <div className="flex items-center gap-2.5">
          <Icon className="size-5 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {disabledReason && (
          <p className="text-xs italic text-muted-foreground">
            {disabledReason}
          </p>
        )}
      </div>
    );
  }

  if (item.repoBadges) {
    return (
      <div className="flex flex-1 flex-col gap-4 rounded-lg border p-5">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.repoBadges.map((badge) => (
            <a
              key={badge.label}
              href={badge.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-accent hover:text-primary"
            >
              {badge.label}
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only">{t.opensInNewTab}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (item.href) {
    const isInternal = item.href.startsWith("/");

    if (isInternal) {
      return (
        <Link
          href={localizeHref(item.href, locale)}
          className="group relative flex flex-1 items-start gap-3 rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-accent"
        >
          <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="absolute right-4 top-5 size-4 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
        </Link>
      );
    }

    // compact: match the download cards' type scale (text-sm title, text-xs
    // description) so link cards sharing a grid with them look identical.
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex flex-1 rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-accent ${
          item.compact ? "items-center gap-2.5" : "items-start gap-3"
        }`}
      >
        <Icon className={`size-5 shrink-0 text-primary ${item.compact ? "" : "mt-0.5"}`} />
        <div className="min-w-0 flex-1">
          <h3 className={item.compact ? "text-sm font-medium" : "font-medium"}>{title}</h3>
          <p
            className={
              item.compact
                ? "whitespace-pre-line text-xs text-muted-foreground"
                : "mt-1 text-sm text-muted-foreground"
            }
          >
            {description}
          </p>
        </div>
        <ExternalLink className="absolute right-4 top-5 size-4 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">{t.opensInNewTab}</span>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex items-center gap-2.5">
        <Icon className="size-5 text-primary" />
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {item.downloads && item.downloads.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.downloads.map((dl) => (
            <a
              key={dl.lang}
              href={dl.href}
              download
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-accent hover:text-primary"
            >
              {dl.lang}
            </a>
          ))}
        </div>
      )}

      {item.externalLinks && item.externalLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.externalLinks.map((link) => (
            <a
              key={`${link.label}-${link.lang}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {link.label} · {link.lang}
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only">{t.opensInNewTab}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
