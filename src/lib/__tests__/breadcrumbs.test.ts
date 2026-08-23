import { describe, it, expect } from "vitest";
import { getBreadcrumbs } from "../breadcrumbs";
import { uiStrings } from "../ui-strings";

describe("getBreadcrumbs", () => {
  it("builds the full localized trail for an action page (en)", () => {
    const crumbs = getBreadcrumbs("/sphere-2/goal-6/action-6-1", "en");
    expect(crumbs.map((c) => c.title)).toEqual([
      uiStrings.en.home,
      uiStrings.en.actionPlan,
      "Sphere 2",
      "Goal 6",
      "Action 6.1",
    ]);
    expect(crumbs.map((c) => c.slug)).toEqual([
      "/en",
      "/en/action-plan",
      "/en/sphere-2",
      "/en/sphere-2/goal-6",
      "/en/sphere-2/goal-6/action-6-1",
    ]);
  });

  it("localizes hierarchy segments for the pathless ca default", () => {
    const crumbs = getBreadcrumbs("/sphere-1/goal-2", "ca");
    expect(crumbs.map((c) => c.slug)).toEqual([
      "/",
      "/pla-accio",
      "/ambit-1",
      "/ambit-1/objectiu-2",
    ]);
    expect(crumbs[2].title).toBe(`${uiStrings.ca.sphere} 1`);
    expect(crumbs[3].title).toBe(`${uiStrings.ca.goal} 2`);
  });

  it("only the action-plan crumb carries a shortTitle", () => {
    const crumbs = getBreadcrumbs("/sphere-3/goal-12", "es");
    const withShort = crumbs.filter((c) => c.shortTitle !== undefined);
    expect(withShort).toHaveLength(1);
    expect(withShort[0].slug).toBe("/es/plan-de-accion");
    expect(withShort[0].shortTitle).toBe(uiStrings.es.actionPlanShort);
  });

  it("uses the member name on profile trails, with a slug fallback", () => {
    const named = getBreadcrumbs(
      "/task-force/victoria-alsina",
      "es",
      "Victòria Alsina"
    );
    expect(named.map((c) => c.title)).toEqual([
      uiStrings.es.home,
      uiStrings.es.taskForceTitle,
      "Victòria Alsina",
    ]);
    expect(named[2].slug).toBe("/es/grupo-de-trabajo/victoria-alsina");

    const fallback = getBreadcrumbs("/task-force/victoria-alsina", "en");
    expect(fallback[2].title).toBe("victoria alsina");
  });

  it("keeps home as the only crumb for the root", () => {
    const crumbs = getBreadcrumbs("/", "en");
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].slug).toBe("/en");
  });

  it("falls back to the raw slug as title for non-hierarchy pages", () => {
    // Both consumers slice off the last crumb, so this raw title never
    // renders today; this documents the fallback so a future full-trail
    // consumer notices it.
    const crumbs = getBreadcrumbs("/press", "en");
    expect(crumbs).toHaveLength(2);
    expect(crumbs[1]).toMatchObject({ slug: "/en/press", title: "/press" });
  });
});
