import Link from "next/link";
import { getCurrentLocale } from "@/lib/route-locale";
import { uiStrings } from "@/lib/ui-strings";
import { localizeHref } from "@/lib/path-utils";

export default async function LocaleNotFound() {
  const locale = await getCurrentLocale();
  const t = uiStrings[locale];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
        {t.notFoundHeading}
      </h1>
      <p className="mb-8 max-w-md text-base leading-relaxed text-foreground/80">
        {t.notFoundBody}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href={localizeHref("/", locale)}
          className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t.goHome}
        </Link>
        <Link
          href={localizeHref("/action-plan", locale)}
          className="inline-flex items-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          {t.exploreActionPlan}
        </Link>
      </div>
    </div>
  );
}
