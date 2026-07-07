import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { pressFaviconPath, type PressArticle } from "@/lib/data/press-coverage";
import type { Locale } from "@/i18n/routing";

export function PressCard({ article, locale }: { article: PressArticle; locale: Locale }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary/30 hover:bg-accent"
    >
      {article.ogImage && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.ogImage}
            alt={article.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pressFaviconPath(article.domain)}
          alt={article.outlet}
          width={16}
          height={16}
          className="size-4 rounded-sm"
          loading="lazy"
        />
        <span className="text-xs font-medium text-muted-foreground">
          {article.outlet}
        </span>
      </div>
      <div className="flex flex-1 items-start px-5 pb-3">
        <h3 className="line-clamp-3 text-sm font-medium leading-relaxed">
          {article.title}
        </h3>
      </div>
      <div className="flex items-center justify-between px-5 pb-4">
        <time className="text-xs text-muted-foreground" dateTime={article.date}>
          {formatDate(article.date, locale)}
        </time>
        <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </a>
  );
}
