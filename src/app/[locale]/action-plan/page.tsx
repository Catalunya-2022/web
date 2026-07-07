import type { Metadata } from "next";
import { getManifest } from "@/lib/content-manifest";
import { ActionPlanSearch } from "@/components/content/action-plan-search";
import { GoalCard } from "@/components/content/goal-card";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { generateActionPlanText } from "@/lib/copy-text-generators";
import { SPHERE_GOALS, ACTION_COUNTS, type SphereId } from "@/lib/data/constants";
import { buildCanonicalGoalPath, buildCanonicalSpherePath } from "@/lib/path-utils";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";
import { SectionHeader } from "@/components/content/section-header";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/action-plan", l);
}

const SPHERES = Object.entries(SPHERE_GOALS).map(([num, goals]) => ({
  num: Number(num) as SphereId,
  goals,
}));

export default async function ActionPlanPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];
  const manifest = await getManifest(l);

  const spheres = SPHERES.map((sphere) => {
    const sphereSlug = buildCanonicalSpherePath(sphere.num);
    const sphereEntry = manifest.entries.get(sphereSlug);
    return {
      num: sphere.num,
      title: sphereEntry?.title ?? `${t.sphere} ${sphere.num}`,
      goals: sphere.goals.map((goalNum) => {
        const goalSlug = buildCanonicalGoalPath(sphere.num, goalNum);
        const entry = manifest.entries.get(goalSlug);
        return {
          goalNum,
          sphereNum: sphere.num,
          title: entry?.title ?? `${t.goal} ${goalNum}`,
          actionCount: ACTION_COUNTS[goalNum],
        };
      }),
    };
  });

  return (
    <SupplementaryPageShell
      slug="/action-plan"
      locale={l}
      subtitle={t.actionPlanSubtitle}
      title={t.actionPlanTitle}
      description={t.actionPlanDescription}
      rawContent={generateActionPlanText(spheres, l)}
    >
      <div className="mb-12">
        <ActionPlanSearch locale={l} />
      </div>

      <section className="mb-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {spheres.map((sphere) => (
            <div key={sphere.num}>
              <SectionHeader subtitle={`${t.sphere} ${sphere.num}`} title={sphere.title} />
              <div className="grid gap-3">
                {sphere.goals.map((goal) => (
                  <GoalCard
                    key={goal.goalNum}
                    goalNum={goal.goalNum}
                    sphereNum={goal.sphereNum}
                    title={goal.title}
                    actionCount={goal.actionCount}
                    locale={l}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SupplementaryPageShell>
  );
}
