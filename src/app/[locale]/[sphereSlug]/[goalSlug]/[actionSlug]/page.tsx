import type { Metadata } from "next";
import { getManifest } from "@/lib/content-manifest";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { uiStrings } from "@/lib/ui-strings";
import {
  buildActionSlug,
  buildCanonicalActionPath,
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  buildGoalSlug,
  buildSphereSlug,
  resolveActionParams,
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
import { getActionRoutes } from "@/lib/page-registry";

type Props = {
  params: Promise<{ locale: string; sphereSlug: string; goalSlug: string; actionSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const l = params.locale as Locale;
  return getActionRoutes().map(({ sphereId, goalId, actionId }) => ({
    sphereSlug: buildSphereSlug(sphereId, l),
    goalSlug: buildGoalSlug(goalId, l),
    actionSlug: buildActionSlug(actionId, l),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l, sphereSlug, goalSlug, actionSlug } =
    await resolveRouteParams(params);
  const resolved = resolveActionParams(sphereSlug, goalSlug, actionSlug);
  if (!resolved) notFound();
  const { sphereId, goalId, actionId } = resolved;
  const slug = buildCanonicalActionPath(sphereId, goalId, actionId);
  return generateContentArticleMetadata(slug, l, HIERARCHY_META_OPTIONS);
}

export default async function ActionPage({ params }: Props) {
  const { locale: l, sphereSlug, goalSlug, actionSlug } =
    await setResolvedRequestParams(params);
  const t = uiStrings[l];
  const resolved = resolveActionParams(sphereSlug, goalSlug, actionSlug);
  if (!resolved) notFound();
  const { sphereId, goalId, actionId } = resolved;
  const slug = buildCanonicalActionPath(sphereId, goalId, actionId);
  const spherePath = buildCanonicalSpherePath(sphereId);
  const goalPath = buildCanonicalGoalPath(sphereId, goalId);
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
      {
        name: manifest.entries.get(goalPath)?.identifier ?? `${t.goal} ${goalId}`,
        url: buildAbsoluteUrl(goalPath, l),
      },
    ],
  });
}
