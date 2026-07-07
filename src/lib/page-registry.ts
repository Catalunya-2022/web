import type { Locale } from "@/i18n/routing";
import { ACTION_COUNTS, SPHERE_GOALS, type GoalId, type SphereId } from "@/lib/data/constants";
import {
  buildCanonicalActionId,
  buildCanonicalActionPath,
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
} from "@/lib/path-utils";
import { uiStrings } from "@/lib/ui-strings";

type UiCopy = (typeof uiStrings)[Locale];

export const STATIC_CONTENT_SLUGS = [
  "/introduction",
  "/executive-summary",
  "/train-of-prosperity",
] as const;

type StaticContentSlug = (typeof STATIC_CONTENT_SLUGS)[number];

export const SUPPLEMENTARY_PAGE_SLUGS = [
  "/action-plan",
  "/task-force",
  "/people-consulted",
  "/organizations",
  "/press",
  "/resources",
  "/mcp",
] as const;

export type SupplementaryPageSlug = (typeof SUPPLEMENTARY_PAGE_SLUGS)[number];

export const PRIMARY_NAV_SLUGS = ["/", ...STATIC_CONTENT_SLUGS] as const;
export const SECONDARY_NAV_SLUGS = SUPPLEMENTARY_PAGE_SLUGS.filter(
  (slug) => slug !== "/action-plan" && slug !== "/mcp"
) as Exclude<SupplementaryPageSlug, "/action-plan" | "/mcp">[];

/** Pages in reading order and manifest but NOT in the sidebar navigation. */
const TAIL_PAGE_SLUGS = SUPPLEMENTARY_PAGE_SLUGS.filter(
  (slug) => slug === "/mcp"
) as Extract<SupplementaryPageSlug, "/mcp">[];

const STATIC_CONTENT_TITLE_SELECTORS: Record<StaticContentSlug, (t: UiCopy) => string> = {
  "/introduction": (t) => t.introductionTitle,
  "/executive-summary": (t) => t.executiveSummaryTitle,
  "/train-of-prosperity": (t) => t.trainOfProsperityTitle,
};

type SupplementaryPageCopy = {
  identifier: (t: UiCopy) => string;
  title: (t: UiCopy) => string;
  description: (t: UiCopy) => string;
  metaDescription?: (t: UiCopy) => string;
  pageTitle?: (t: UiCopy) => string;
};

const SUPPLEMENTARY_PAGE_COPY: Record<SupplementaryPageSlug, SupplementaryPageCopy> = {
  "/action-plan": {
    identifier: (t) => t.actionPlanSubtitle,
    title: (t) => t.actionPlanTitle,
    description: (t) => t.actionPlanDescription,
    metaDescription: (t) => t.actionPlanMetaDescription,
    pageTitle: (t) => t.actionPlan,
  },
  "/task-force": {
    identifier: (t) => t.taskForceSubtitle,
    title: (t) => t.taskForceTitle,
    description: (t) => t.taskForceDescription,
    metaDescription: (t) => t.taskForceMetaDescription,
  },
  "/people-consulted": {
    identifier: (t) => t.peopleConsultedSubtitle,
    title: (t) => t.peopleConsultedTitle,
    description: (t) => t.peopleConsultedDescription,
  },
  "/organizations": {
    identifier: (t) => t.organizationsSubtitle,
    title: (t) => t.organizationsTitle,
    description: (t) => t.organizationsDescription,
    metaDescription: (t) => t.organizationsMetaDescription,
  },
  "/press": {
    identifier: (t) => t.pressSubtitle,
    title: (t) => t.pressTitle,
    description: (t) => t.pressDescription,
    metaDescription: (t) => t.pressMetaDescription,
  },
  "/resources": {
    identifier: (t) => t.resourcesSubtitle,
    title: (t) => t.resourcesTitle,
    description: (t) => t.resourcesDescription,
  },
  "/mcp": {
    identifier: (t) => t.mcpSubtitle,
    title: (t) => t.mcpTitle,
    description: (t) => t.mcpDescription,
    pageTitle: (t) => t.mcpPageTitle,
  },
};

const STATIC_CONTENT_SLUG_SET = new Set<string>(STATIC_CONTENT_SLUGS);
// Derived from SPHERE_GOALS (the sphere→goal SSOT); integer-like keys
// enumerate in ascending numeric order per the JS spec.
const SPHERE_IDS = Object.keys(SPHERE_GOALS).map(Number) as SphereId[];

export function isStaticContentSlug(slug: string): slug is StaticContentSlug {
  return STATIC_CONTENT_SLUG_SET.has(slug);
}

export function getStaticContentPageTitle(
  slug: StaticContentSlug,
  locale: Locale
): string {
  return STATIC_CONTENT_TITLE_SELECTORS[slug](uiStrings[locale]);
}

export function getSupplementaryPageCopy(
  slug: SupplementaryPageSlug,
  locale: Locale
): {
  identifier: string;
  title: string;
  description: string;
  metaDescription: string;
  pageTitle: string;
} {
  const t = uiStrings[locale];
  const selectors = SUPPLEMENTARY_PAGE_COPY[slug];

  return {
    identifier: selectors.identifier(t),
    title: selectors.title(t),
    description: selectors.description(t),
    metaDescription: selectors.metaDescription?.(t) ?? selectors.description(t),
    pageTitle: selectors.pageTitle?.(t) ?? selectors.title(t),
  };
}

export function getSphereIds(): readonly SphereId[] {
  return SPHERE_IDS;
}

export function getGoalRoutes(): Array<{ sphereId: SphereId; goalId: GoalId }> {
  const routes: Array<{ sphereId: SphereId; goalId: GoalId }> = [];

  for (const sphereId of SPHERE_IDS) {
    for (const goalId of SPHERE_GOALS[sphereId]) {
      routes.push({ sphereId, goalId });
    }
  }

  return routes;
}

export function getActionRoutes(): Array<{
  sphereId: SphereId;
  goalId: GoalId;
  actionId: string;
}> {
  const routes: Array<{ sphereId: SphereId; goalId: GoalId; actionId: string }> = [];

  for (const { sphereId, goalId } of getGoalRoutes()) {
    const actionCount = ACTION_COUNTS[goalId];
    for (let actionNum = 1; actionNum <= actionCount; actionNum++) {
      routes.push({
        sphereId,
        goalId,
        actionId: buildCanonicalActionId(goalId, actionNum),
      });
    }
  }

  return routes;
}

function buildHierarchyContentSlugs(): string[] {
  const slugs: string[] = [];

  for (const sphereId of SPHERE_IDS) {
    slugs.push(buildCanonicalSpherePath(sphereId));

    for (const goalId of SPHERE_GOALS[sphereId]) {
      const goalSlug = buildCanonicalGoalPath(sphereId, goalId);
      slugs.push(goalSlug);

      for (let actionNum = 1; actionNum <= ACTION_COUNTS[goalId]; actionNum++) {
        slugs.push(
          buildCanonicalActionPath(
            sphereId,
            goalId,
            buildCanonicalActionId(goalId, actionNum)
          )
        );
      }
    }
  }

  return slugs;
}

export function buildContentDocumentSlugs(): string[] {
  return [...STATIC_CONTENT_SLUGS, ...buildHierarchyContentSlugs()];
}

export function buildReadingOrder(): string[] {
  return [
    "/",
    ...STATIC_CONTENT_SLUGS,
    "/action-plan",
    ...buildHierarchyContentSlugs(),
    ...SECONDARY_NAV_SLUGS,
    ...TAIL_PAGE_SLUGS,
  ];
}
