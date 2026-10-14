import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

test.beforeEach(() => {
  test.skip(test.info().project.name !== "desktop-chromium", "Desktop-only attribute checks");
});

test("the sidebar is exposed as a labelled navigation landmark", async ({ page }) => {
  await gotoStablePage(page, "/en/sphere-1/goal-1/action-1-1");

  await expect(page.getByRole("navigation", { name: "Navigation", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navigation", exact: true }).getByRole("link", { name: "Action Plan" })).toBeVisible();
});

test("closing the search dialog returns focus to the search button", async ({ page }) => {
  await gotoStablePage(page, "/en");

  const button = page.getByRole("button", { name: "Search" });
  await button.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(button).toBeFocused();
});

test("the search combobox has an accessible name", async ({ page }) => {
  await gotoStablePage(page, "/en");

  await page.keyboard.press("Control+K");
  await expect(page.getByRole("combobox", { name: /search/i })).toBeVisible();
});

test("the home heading is named by the complete RESET sentence", async ({ page }) => {
  await gotoStablePage(page, "/en");

  await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute("aria-label", /^RESET: .+\.$/);
});

test("press titles in Catalan or Spanish declare their language", async ({ page }) => {
  await gotoStablePage(page, "/en/press");

  await expect(page.locator("h3[lang]").first()).toHaveAttribute("lang", /^(ca|es)$/);
});

test("the 404 page has one main landmark, a level-1 heading and the URL's language", async ({ page }) => {
  await gotoStablePage(page, "/en/no-such-page");

  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: Page not found");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("button", { name: "Search the document" })).toBeVisible();
});
