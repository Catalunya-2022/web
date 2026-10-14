import { NotFoundContent } from "@/components/content/not-found-content";
import { NotFoundTracker } from "@/components/content/not-found-tracker";
import { getCurrentLocale } from "@/lib/route-locale";

/**
 * Reached only when notFound() is thrown under the locale layout; with
 * dynamicParams false everywhere the root boundary serves bad URLs instead.
 * Shares the root boundary's body so the two can never drift.
 */
export default async function LocaleNotFound() {
  const locale = await getCurrentLocale();

  return (
    <>
      <NotFoundTracker />
      <NotFoundContent initialLocale={locale} />
    </>
  );
}
