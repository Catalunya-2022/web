import { describe, expect, it } from "vitest";
import { getManifest } from "../content-manifest";
import { getNavigation } from "../navigation-server";
import type { NavItem, NavSection } from "../navigation-server";

function findNavItem(items: NavItem[], slug: string): NavItem | null {
  for (const item of items) {
    if (item.slug === slug) return item;

    const childMatch = item.children ? findNavItem(item.children, slug) : null;
    if (childMatch) return childMatch;
  }

  return null;
}

function findNavItemInSections(
  sections: NavSection[],
  slug: string
): NavItem | null {
  for (const section of sections) {
    const match = findNavItem(section.items, slug);
    if (match) return match;
  }

  return null;
}

describe("getNavigation", () => {
  it("keeps curated title-case labels for top-level content pages", async () => {
    const nav = await getNavigation("en");

    expect(findNavItemInSections(nav, "/introduction")?.title).toBe(
      "Introduction"
    );
    expect(findNavItemInSections(nav, "/executive-summary")?.title).toBe(
      "Executive Summary"
    );
    expect(findNavItemInSections(nav, "/train-of-prosperity")?.title).toBe(
      "The Train of Prosperity"
    );
  });

  it("keeps concise sphere summaries in the sidebar", async () => {
    const nav = await getNavigation("en");

    expect(findNavItemInSections(nav, "/sphere-2")?.title).toBe(
      "Sphere 2: Economy"
    );
  });

  it("uses manifest page titles for goal entries", async () => {
    const [manifest, nav] = await Promise.all([
      getManifest("en"),
      getNavigation("en"),
    ]);

    expect(findNavItemInSections(nav, "/sphere-2/goal-7")?.title).toBe(
      manifest.entries.get("/sphere-2/goal-7")?.pageTitle
    );
  });

  it("keeps concise goal summaries in the sidebar", async () => {
    const nav = await getNavigation("ca");

    expect(findNavItemInSections(nav, "/sphere-2/goal-7")?.title).toBe(
      "Objectiu 7: Coneixement i Explotació"
    );
  });

  it("uses manifest page titles for action entries", async () => {
    const [manifest, nav] = await Promise.all([
      getManifest("ca"),
      getNavigation("ca"),
    ]);

    expect(findNavItemInSections(nav, "/sphere-3/goal-12/action-12-4")?.title).toBe(
      manifest.entries.get("/sphere-3/goal-12/action-12-4")?.pageTitle
    );
  });
});
