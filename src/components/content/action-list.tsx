import Link from "next/link";
import { getManifest } from "@/lib/content-manifest";
import type { GoalId, SphereId } from "@/lib/data/constants";
import { buildCanonicalGoalPath, localizeHref, parseHierarchySlug } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

export async function ActionList({
  sphereNum,
  goalNum,
  locale,
}: {
  sphereNum: SphereId;
  goalNum: GoalId;
  locale: Locale;
}) {
  const manifest = await getManifest(locale);

  const prefix = `${buildCanonicalGoalPath(sphereNum, goalNum)}/action-`;
  const actions = manifest.readingOrder
    .filter((slug) => slug.startsWith(prefix))
    .map((slug) => {
      const entry = manifest.entries.get(slug);
      const parsed = parseHierarchySlug(slug);
      return {
        slug,
        label: parsed?.kind === "action" ? parsed.actionId.replace("-", ".") : "",
        title: entry?.title ?? slug,
      };
    });

  if (actions.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">
        {uiStrings[locale].actions}
      </h2>
      <ol className="space-y-2">
        {actions.map((action) => (
          <li key={action.slug}>
            <Link
              href={localizeHref(action.slug, locale)}
              className="group flex gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <span className="shrink-0 font-semibold text-primary">
                {action.label}
              </span>
              <span className="text-foreground/80 group-hover:text-foreground">
                {action.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
