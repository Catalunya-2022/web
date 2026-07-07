import type { Metadata } from "next";
import { getManifest } from "@/lib/content-manifest";
import { ActionList } from "@/components/content/action-list";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { uiStrings } from "@/lib/ui-strings";
import {
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  buildGoalSlug,
  buildSphereSlug,
  resolveGoalParams,
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
import { getGoalRoutes } from "@/lib/page-registry";

type Props = {
  params: Promise<{ locale: string; sphereSlug: string; goalSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const l = params.locale as Locale;
  return getGoalRoutes().map(({ sphereId, goalId }) => ({
    sphereSlug: buildSphereSlug(sphereId, l),
    goalSlug: buildGoalSlug(goalId, l),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l, sphereSlug, goalSlug } = await resolveRouteParams(params);
  const resolved = resolveGoalParams(sphereSlug, goalSlug);
  if (!resolved) notFound();
  const { sphereId, goalId } = resolved;
  const slug = buildCanonicalGoalPath(sphereId, goalId);
  return generateContentArticleMetadata(slug, l, HIERARCHY_META_OPTIONS);
}

export default async function GoalPage({ params }: Props) {
  const { locale: l, sphereSlug, goalSlug } =
    await setResolvedRequestParams(params);
  const t = uiStrings[l];
  const resolved = resolveGoalParams(sphereSlug, goalSlug);
  if (!resolved) notFound();
  const { sphereId, goalId } = resolved;
  const slug = buildCanonicalGoalPath(sphereId, goalId);
  const spherePath = buildCanonicalSpherePath(sphereId);
  const manifest = await getManifest(l);

  return renderArticleContentPage({
    slug,
    locale: l,
    metaOptions: HIERARCHY_META_OPTIONS,
    leadingBreadcrumbs: [
      getHomeBreadcrumb(l),
      { name: t.actionPlan, url: buildAbsoluteUrl("/action-plan", l) },
      {
        name: manifest.entries.get(spherePath)?.identifier ?? `${t.sphere} ${sphereId}`,
        url: buildAbsoluteUrl(spherePath, l),
      },
    ],
    children: (
      <ActionList sphereNum={sphereId} goalNum={goalId} locale={l} />
    ),
  });
}
