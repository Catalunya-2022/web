import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { pressFaviconPath, type PressArticle } from "@/lib/data/press-coverage";
import type { Locale } from "@/i18n/routing";

export function PressTable({ articles, locale }: { articles: PressArticle[]; locale: Locale }) {
  if (articles.length === 0) return null;

  return (
    <ul className="divide-y">
      {articles.map((article) => (
        <li key={article.url} className="py-2.5">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-sm transition-colors hover:text-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pressFaviconPath(article.domain)}
              alt={article.outlet}
              width={16}
              height={16}
              className="size-4 shrink-0 rounded-sm"
              loading="lazy"
            />
            <span className="hidden w-36 shrink-0 text-xs text-muted-foreground sm:inline">
              {article.outlet}
            </span>
            <span className="min-w-0 flex-1 truncate">{article.title}</span>
            <time
              className="hidden shrink-0 text-xs text-muted-foreground sm:block"
              dateTime={article.date}
            >
              {formatDate(article.date, locale)}
            </time>
            <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </li>
      ))}
    </ul>
  );
}
