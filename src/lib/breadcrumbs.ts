import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import {
  buildCanonicalActionPath,
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  localizeHref,
  parseHierarchySlug,
} from "@/lib/path-utils";

type Crumb = { slug: string; title: string; shortTitle?: string };

/** Build a short breadcrumb trail.
 *  Sphere/goal/action use short labels ("Sphere 2", "Goal 6", "Action 6.1").
 *  Full page titles are intentionally NOT used — they belong in the page heading. */
export function getBreadcrumbs(slug: string, locale: Locale, memberName?: string): Crumb[] {
  const t = uiStrings[locale];

  const parts = slug.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ slug: "/", title: t.home }];
  const parsed = parseHierarchySlug(slug);

  if (parsed) {
    crumbs.push({ slug: "/action-plan", title: t.actionPlan, shortTitle: t.actionPlanShort });
    const sphereSlug = buildCanonicalSpherePath(parsed.sphereId);
    crumbs.push({
      slug: sphereSlug,
      title: `${t.sphere} ${parsed.sphereId}`,
    });

    if (parsed.kind === "goal" || parsed.kind === "action") {
      const goalSlug = buildCanonicalGoalPath(parsed.sphereId, parsed.goalId);
      crumbs.push({
        slug: goalSlug,
        title: `${t.goal} ${parsed.goalId}`,
      });
    }

    if (parsed.kind === "action") {
      const actionSlug = buildCanonicalActionPath(
        parsed.sphereId,
        parsed.goalId,
        parsed.actionId
      );
      crumbs.push({
        slug: actionSlug,
        title: `${t.action} ${parsed.actionId.replace("-", ".")}`,
      });
    }
  } else if (parts[0] === "task-force" && parts[1]) {
    crumbs.push({ slug: "/task-force", title: t.taskForceTitle });
    crumbs.push({ slug, title: memberName ?? parts[1].replace(/-/g, " ") });
  } else if (slug !== "/") {
    crumbs.push({ slug, title: slug });
  }

  return crumbs.map((c) => ({ ...c, slug: localizeHref(c.slug, locale) }));
}
