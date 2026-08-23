import Link from "next/link";
import { NotFoundTracker } from "@/components/content/not-found-tracker";
import { localizeHref } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";

export default function NotFound() {
  return (
    <html lang="ca">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        <NotFoundTracker />
        {/* No locale segment is available in this boundary, so fall back to the site's default language. */}
        <h1 className="text-2xl font-bold tracking-tight">Pàgina no trobada</h1>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="text-primary underline-offset-2 hover:underline">
            Tornar a l&apos;inici
          </Link>
          <span aria-hidden="true"> · </span>
          <Link
            href={localizeHref("/action-plan", "ca")}
            className="text-primary underline-offset-2 hover:underline"
          >
            {uiStrings.ca.exploreActionPlan}
          </Link>
        </p>
        {/* Recovery pointers for agents and crawlers that land on a dead URL. */}
        <p className="text-xs text-muted-foreground">
          <a href="/sitemap.xml" className="underline underline-offset-2 hover:text-foreground">
            {uiStrings.ca.siteMap}
          </a>
          <span aria-hidden="true"> · </span>
          <a href="/llms.txt" className="underline underline-offset-2 hover:text-foreground">
            llms.txt
          </a>
        </p>
      </body>
    </html>
  );
}
