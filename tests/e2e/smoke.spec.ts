import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

test("home page keeps its primary search and action entry points", async ({ page }) => {
  await gotoStablePage(page, "/en");

  await expect(page.getByRole("link", { name: /Catalunya 2022/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore All Actions/i })).toBeVisible();
});

test("keyboard search navigates to a selected result", async ({ page }) => {
  await gotoStablePage(page, "/en");

  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog")).toBeVisible();

  const input = page.getByPlaceholder("Search spheres, goals, actions...");
  await input.fill("victoria");

  const result = page.getByText("Victòria Alsina").first();
  await expect(result).toBeVisible();
  await result.click();

  await expect(page).toHaveURL(/\/en\/task-force\/victoria-alsina$/);
  await expect(page.getByRole("heading", { name: "Victòria Alsina" })).toBeVisible();
});

test("language switching preserves the explicit user choice", async ({ page }) => {
  await gotoStablePage(page, "/en/introduction");

  if (test.info().project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  }

  await page.getByRole("button", { name: "English" }).click();
  await page.getByText("Español").click();

  // The user-visible contract is the localized navigation target.
  // Cookie persistence is covered separately and can vary on localhost.
  await expect(page).toHaveURL(/\/es\/introduccion$/);
});

test("member previous and next navigation stays intact", async ({ page }) => {
  await gotoStablePage(page, "/en/task-force/victoria-alsina");

  await page.getByRole("link", { name: /Next: Genís Roca/i }).click();
  await expect(page).toHaveURL(/\/en\/task-force\/genis-roca$/);
  await expect(page.getByRole("heading", { name: "Genís Roca" })).toBeVisible();
});

test("not found pages still route users back into the site", async ({ page }) => {
  await gotoStablePage(page, "/en/sphere-1/goal-1/action-1-99");

  await expect(page.getByRole("heading", { name: "Pàgina no trobada" })).toBeVisible();

  await page.getByRole("link", { name: "Tornar a l'inici" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("mobile sidebar navigation still reaches the action plan", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only navigation check");

  await gotoStablePage(page, "/en/introduction");

  await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  await page.getByRole("link", { name: "Action Plan" }).click();

  await expect(page).toHaveURL(/\/en\/action-plan$/);
  await expect(page.getByRole("heading", { name: /Reset: Call to reactivate Catalonia/i })).toBeVisible();
});

// Regression: hierarchy pages must not emit an HTTP Link header with hreflang.
// Before the fix, next-intl's middleware fallback wrote wrong cross-locale URLs here,
// which Google crawled and reported as 404s. After `alternateLinks: false`, the HTML
// <link rel="alternate"> tags from metadata.alternates are the sole hreflang signal.
test("CA hierarchy pages do not emit hreflang Link header", async ({ request }) => {
  const response = await request.get("/en/sphere-1/goal-4/action-4-3", {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  const link = response.headers()["link"] ?? "";
  expect(link).not.toContain("hreflang");
});

// Regression: CA dynamic member URL with foreign Accept-Language must stay on CA.
// Before the fix, /grup-de-treball/<member> fell through to next-intl which 307-redirected
// to /en/task-force/<member> based on Accept-Language: en. The new resolveLocalizedRoute
// helper walks PARSED_CATALOG so dynamic routes are intercepted before next-intl.
test.describe("CA dynamic route ignores foreign Accept-Language", () => {
  test.use({ extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" } });

  test("clicks member from /grup-de-treball, stays on CA", async ({ page }) => {
    await gotoStablePage(page, "/grup-de-treball");
    await page.getByRole("link", { name: /Victòria Alsina/i }).click();
    await expect(page).toHaveURL(/\/grup-de-treball\/victoria-alsina$/);
    await expect(page.getByRole("heading", { name: "Victòria Alsina" })).toBeVisible();
    // Heading is the member name (locale-neutral); assert a Catalan UI string instead.
    await expect(page.getByText(/Coordinadora del Grup de Treball/i)).toBeVisible();
  });
});
