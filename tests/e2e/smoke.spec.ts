import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

test("home page keeps its primary search and action entry points", async ({ page }) => {
  await gotoStablePage(page, "/en");

  await expect(page.getByRole("link", { name: /Catalunya 2022/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore All Actions/i })).toBeVisible();
});

test("a browser without the WebMCP API loads with no tool code and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    const fromAnalytics = [message.text(), message.location().url].some((s) => s.includes("/reset/"));
    if (message.type() === "error" && !fromAnalytics) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await gotoStablePage(page, "/en");

  expect(await page.evaluate(() => typeof document.modelContext)).toBe("undefined");
  expect(errors).toEqual([]);
});

// Regression: pathless Catalan URLs are served through an internal /ca rewrite,
// so the prerendered markup and the browser must agree on the canonical path or
// React throws a hydration error (#418) and re-renders the tree client-side.
for (const pathname of ["/", "/ambit-1/objectiu-2/accio-2-1", "/grup-de-treball/victoria-alsina", "/pla-accio"]) {
  test(`${pathname} hydrates without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await gotoStablePage(page, pathname);

    expect(errors).toEqual([]);
  });
}

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

  await page.getByRole("link", { name: /Next\s*:?\s*Genís Roca/i }).click();
  await expect(page).toHaveURL(/\/en\/task-force\/genis-roca$/);
  await expect(page.getByRole("heading", { name: "Genís Roca" })).toBeVisible();
});

test("not found pages still route users back into the site", async ({ page }) => {
  await gotoStablePage(page, "/en/sphere-1/goal-1/action-1-99");

  await expect(page.getByRole("heading", { name: "404: Page not found" })).toBeVisible();

  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL(/\/en$/);
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

test("a bad English action URL gets a real 404 with the English hierarchy copy", async ({ page }) => {
  const response = await page.goto("/en/sphere-1/goal-1/action-1-99", { waitUntil: "networkidle" });

  expect(response?.status()).toBe(404);
  await expect(page).toHaveURL(/\/en\/sphere-1\/goal-1\/action-1-99$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: Page not found");
  await expect(page).toHaveTitle("404: Page not found");
  await expect(page.getByText(/We couldn't find this sphere, goal, or action/)).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/en");
  await expect(page.getByRole("link", { name: "llms.txt" })).toHaveAttribute("href", "/en/llms.txt");
});

// An unknown pathless URL is first locale-negotiated by next-intl (an English
// browser is sent to /en/no-such-page), so the Catalan 404 is asserted with a
// Catalan browser; the English redirect case is covered just below. The
// browser locale is set with `locale`: the fixture's locale emulation
// overrides an Accept-Language given through extraHTTPHeaders.
test.describe("pathless not-found URLs", () => {
  test.describe("with a Catalan browser", () => {
    test.use({ locale: "ca-ES" });

    test("a bad pathless URL gets the Catalan 404 with the generic copy", async ({ page }) => {
      const response = await page.goto("/no-such-page", { waitUntil: "networkidle" });

      expect(response?.status()).toBe(404);
      await expect(page).toHaveURL(/\/no-such-page$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: Pàgina no trobada");
      await expect(page).toHaveTitle("404: Pàgina no trobada");
      await expect(page.getByText(/No hem trobat cap pàgina en aquesta adreça/)).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", "ca");
      await expect(page.getByRole("link", { name: "Anar a l'inici" })).toHaveAttribute("href", "/");
    });
  });

  test("an English browser is sent to the English 404 for a bad pathless URL", async ({ page }) => {
    const response = await page.goto("/no-such-page", { waitUntil: "networkidle" });

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL(/\/en\/no-such-page$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("404: Page not found");
    await expect(page).toHaveTitle("404: Page not found");
    await expect(page.getByText(/There is no page at this address/)).toBeVisible();
  });
});

test("the 404 page searches the document and navigates to a result", async ({ page }) => {
  await page.goto("/es/ambito-9", { waitUntil: "networkidle" });

  await expect(page.getByText(/No hemos encontrado este ámbito, objetivo o acción/)).toBeVisible();
  await page.getByRole("button", { name: "Buscar en el documento" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("combobox").fill("victoria");
  const result = page.getByText("Victòria Alsina").first();
  await expect(result).toBeVisible();
  await result.click();

  await expect(page).toHaveURL(/\/es\/grupo-de-trabajo\/victoria-alsina$/);
  await expect(page.getByRole("heading", { name: "Victòria Alsina" })).toBeVisible();
});
