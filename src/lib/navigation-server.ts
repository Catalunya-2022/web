import { getManifest } from "@/lib/content-manifest";
import type { Locale } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";
import {
  ACTION_COUNTS,
  SPHERE_GOALS,
  type GoalId,
  type SphereId,
} from "@/lib/data/constants";
import type { ContentManifest } from "@/lib/content-manifest";
import {
  PRIMARY_NAV_SLUGS,
  SECONDARY_NAV_SLUGS,
  getSphereIds,
  getStaticContentPageTitle,
  getSupplementaryPageCopy,
} from "@/lib/page-registry";
import {
  actionLabel,
  buildCanonicalActionId,
  buildCanonicalActionPath,
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  goalLabel,
  sphereLabel,
} from "@/lib/path-utils";

export type NavItem = {
  slug: string;
  title: string;
  children?: NavItem[];
};

export type NavSection = {
  items: NavItem[];
};

const navigationCache = new Map<Locale, Promise<NavSection[]>>();

function getEntryTitle(
  manifest: ContentManifest,
  slug: string,
  fallback: string
): string {
  return manifest.entries.get(slug)?.pageTitle ?? fallback;
}

function buildGoalNavigation(
  manifest: ContentManifest,
  sphereId: SphereId,
  goalId: GoalId,
  locale: Locale
): NavItem {
  const goalSlug = buildCanonicalGoalPath(sphereId, goalId);

  return {
    slug: goalSlug,
    title: getEntryTitle(manifest, goalSlug, goalLabel(goalId, locale)),
    children: Array.from({ length: ACTION_COUNTS[goalId] }, (_, index) => {
      const actionId = buildCanonicalActionId(goalId, index + 1);
      const actionSlug = buildCanonicalActionPath(sphereId, goalId, actionId);

      return {
        slug: actionSlug,
        title: getEntryTitle(manifest, actionSlug, actionLabel(actionId, locale)),
      };
    }),
  };
}

function buildSphereNavigation(
  manifest: ContentManifest,
  sphereId: SphereId,
  locale: Locale
): NavItem {
  const sphereSlug = buildCanonicalSpherePath(sphereId);

  return {
    slug: sphereSlug,
    title: getEntryTitle(manifest, sphereSlug, sphereLabel(sphereId, locale)),
    children: SPHERE_GOALS[sphereId].map((goalId) =>
      buildGoalNavigation(manifest, sphereId, goalId, locale)
    ),
  };
}

async function buildNavigation(locale: Locale): Promise<NavSection[]> {
  const manifest = await getManifest(locale);
  const t = uiStrings[locale];
  const primaryItems = PRIMARY_NAV_SLUGS.map((slug) => ({
    slug,
    title:
      slug === "/"
        ? getEntryTitle(manifest, slug, t.home)
        : getEntryTitle(manifest, slug, getStaticContentPageTitle(slug, locale)),
  }));
  const secondaryItems = SECONDARY_NAV_SLUGS.map((slug) => ({
    slug,
    title: getEntryTitle(manifest, slug, getSupplementaryPageCopy(slug, locale).pageTitle),
  }));

  return [
    {
      items: primaryItems,
    },
    {
      items: [
        {
          slug: "/action-plan",
          title: getEntryTitle(manifest, "/action-plan", t.actionPlan),
          children: getSphereIds().map((sphereId) =>
            buildSphereNavigation(manifest, sphereId, locale)
          ),
        },
      ],
    },
    {
      items: secondaryItems,
    },
  ];
}

export async function getNavigation(locale: Locale): Promise<NavSection[]> {
  const cached = navigationCache.get(locale);
  if (cached) return cached;

  const navigationPromise = buildNavigation(locale);
  navigationCache.set(locale, navigationPromise);

  try {
    return await navigationPromise;
  } catch (error) {
    if (navigationCache.get(locale) === navigationPromise) navigationCache.delete(locale);
    throw error;
  }
}

export async function getNextPage(
  currentSlug: string,
  locale: Locale
): Promise<{ slug: string; title: string } | null> {
  const manifest = await getManifest(locale);
  const idx = manifest.readingOrder.indexOf(currentSlug);
  if (idx === -1 || idx === manifest.readingOrder.length - 1) return null;
  const slug = manifest.readingOrder[idx + 1];
  const entry = manifest.entries.get(slug);
  return { slug, title: entry?.pageTitle ?? slug };
}

export async function getPrevPage(
  currentSlug: string,
  locale: Locale
): Promise<{ slug: string; title: string } | null> {
  const manifest = await getManifest(locale);
  const idx = manifest.readingOrder.indexOf(currentSlug);
  if (idx <= 0) return null;
  const slug = manifest.readingOrder[idx - 1];
  const entry = manifest.entries.get(slug);
  return { slug, title: entry?.pageTitle ?? slug };
}
