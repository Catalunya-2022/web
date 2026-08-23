import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

const desktopPages = [
  { name: "home", pathname: "/en" },
  { name: "introduction", pathname: "/en/introduction" },
  { name: "sphere-1", pathname: "/en/sphere-1" },
  { name: "goal-1", pathname: "/en/sphere-1/goal-1" },
  { name: "action-1-1", pathname: "/en/sphere-1/goal-1/action-1-1" },
  { name: "action-plan", pathname: "/en/action-plan" },
  { name: "member-profile", pathname: "/en/task-force/victoria-alsina" },
  { name: "organizations", pathname: "/en/organizations" },
  { name: "mcp", pathname: "/en/mcp" },
] as const;

const mobilePages = [
  { name: "home-mobile", pathname: "/en" },
  { name: "action-plan-mobile", pathname: "/en/action-plan" },
  { name: "member-profile-mobile", pathname: "/en/task-force/victoria-alsina" },
  { name: "not-found-mobile", pathname: "/en/sphere-1/goal-1/action-1-99" },
] as const;

for (const pageCase of desktopPages) {
  test(`desktop visual regression: ${pageCase.name}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only snapshot");

    if (pageCase.name === "home") {
      await page.addInitScript(() => {
        (window as Window & { __CATALUNYA_FREEZE_HERO__?: boolean }).__CATALUNYA_FREEZE_HERO__ = true;
      });
    }

    await gotoStablePage(page, pageCase.pathname);

    await expect(page).toHaveScreenshot(`${pageCase.name}.png`, {
      animations: "disabled",
      caret: "hide",
    });
  });
}

for (const pageCase of mobilePages) {
  test(`mobile visual regression: ${pageCase.name}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only snapshot");

    if (pageCase.name === "home-mobile") {
      await page.addInitScript(() => {
        (window as Window & { __CATALUNYA_FREEZE_HERO__?: boolean }).__CATALUNYA_FREEZE_HERO__ = true;
      });
    }

    await gotoStablePage(page, pageCase.pathname);

    await expect(page).toHaveScreenshot(`${pageCase.name}.png`, {
      animations: "disabled",
      caret: "hide",
    });
  });
}
