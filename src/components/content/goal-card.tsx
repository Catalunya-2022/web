import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GoalId, SphereId } from "@/lib/data/constants";
import { buildCanonicalGoalPath, localizeHref } from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

export function GoalCard({
  goalNum,
  sphereNum,
  title,
  actionCount,
  locale,
}: {
  goalNum: GoalId;
  sphereNum: SphereId;
  title: string;
  actionCount: number;
  locale: Locale;
}) {
  const slug = buildCanonicalGoalPath(sphereNum, goalNum);
  const t = uiStrings[locale];

  return (
    <Link
      href={localizeHref(slug, locale)}
      className="group flex flex-col justify-between rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-accent"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.goal} {goalNum}
        </p>
        <h3 className="mt-1.5 text-sm font-medium leading-snug">{title}</h3>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {actionCount} {actionCount === 1 ? t.action.toLowerCase() : t.actions.toLowerCase()}
        </span>
        <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
