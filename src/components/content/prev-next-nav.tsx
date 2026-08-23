import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavTarget = {
  href: string;
  label: string;
  title: string;
};

export function PrevNextNav({
  prev,
  next,
  ariaLabel,
}: {
  prev: NavTarget | null;
  next: NavTarget | null;
  ariaLabel: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-12 grid grid-cols-1 gap-4 print:hidden sm:grid-cols-2"
      aria-label={ariaLabel}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-primary/30 hover:bg-accent"
          aria-label={`${prev.label}: ${prev.title}`}
        >
          <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{prev.label}</p>
            <p className="truncate text-sm font-medium">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center justify-end gap-3 rounded-lg border p-4 text-right transition-colors hover:border-primary/30 hover:bg-accent"
          aria-label={`${next.label}: ${next.title}`}
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{next.label}</p>
            <p className="truncate text-sm font-medium">{next.title}</p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
