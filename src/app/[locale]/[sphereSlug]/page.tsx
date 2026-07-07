import type { Metadata } from "next";
import { getManifest } from "@/lib/content-manifest";
import { GoalCard } from "@/components/content/goal-card";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { uiStrings } from "@/lib/ui-strings";
import { SPHERE_GOALS, ACTION_COUNTS } from "@/lib/data/constants";
import {
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  buildSphereSlug,
  resolveSphereParams,
} from "@/lib/path-utils";
import type { Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import {
  resolveRouteParams,
  setResolvedRequestParams,
} from "@/lib/route-locale";
import {
  generateContentArticleMetadata,
  getHomeBreadcrumb,
  HIERARCHY_META_OPTIONS,
  renderArticleContentPage,
} from "@/lib/content-article-route";
import { getSphereIds } from "@/lib/page-registry";

type Props = {
  params: Promise<{ locale: string; sphereSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const l = params.locale as Locale;
  return getSphereIds().map((id) => ({
    sphereSlug: buildSphereSlug(id, l),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l, sphereSlug } = await resolveRouteParams(params);
  const resolved = resolveSphereParams(sphereSlug);
  if (!resolved) notFound();
  const { sphereId } = resolved;
  const slug = buildCanonicalSpherePath(sphereId);
  return generateContentArticleMetadata(slug, l, HIERARCHY_META_OPTIONS);
}

export default async function SpherePage({ params }: Props) {
  const { locale: l, sphereSlug } = await setResolvedRequestParams(params);
  const t = uiStrings[l];
  const resolved = resolveSphereParams(sphereSlug);
  if (!resolved) notFound();
  const { sphereId } = resolved;
  const slug = buildCanonicalSpherePath(sphereId);
  const manifest = await getManifest(l);
  const goalNums = SPHERE_GOALS[sphereId] ?? [];

  return renderArticleContentPage({
    slug,
    locale: l,
    metaOptions: HIERARCHY_META_OPTIONS,
    leadingBreadcrumbs: [
      getHomeBreadcrumb(l),
      { name: t.actionPlan, url: buildAbsoluteUrl("/action-plan", l) },
    ],
    children: (
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">
          {t.goals}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {goalNums.map((goalNum) => {
            const goalSlug = buildCanonicalGoalPath(sphereId, goalNum);
            const entry = manifest.entries.get(goalSlug);
            return (
              <GoalCard
                key={goalNum}
                goalNum={goalNum}
                sphereNum={sphereId}
                title={entry?.title ?? `${t.goal} ${goalNum}`}
                actionCount={ACTION_COUNTS[goalNum]}
                locale={l}
              />
            );
          })}
        </div>
      </section>
    ),
  });
}
