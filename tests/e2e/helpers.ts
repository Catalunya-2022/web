import { expect, type Page } from "@playwright/test";

export async function gotoStablePage(page: Page, pathname: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(pathname, { waitUntil: "networkidle" });
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => document.fonts?.status !== "loading");
  await expect(page.locator("body")).toBeVisible();
  await page.mouse.move(0, 0);
}
