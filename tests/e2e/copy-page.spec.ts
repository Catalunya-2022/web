import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

const PATHNAME = "/en/sphere-1/goal-1/action-1-1";
const CANONICAL_URL = `https://2022.cat${PATHNAME}`;

test.describe("copy-page dropdown", () => {
  test.beforeEach(async ({ context }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only copy dropdown");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("Copy as Markdown puts the page markdown with its canonical URL on the clipboard", async ({ page }) => {
    await gotoStablePage(page, PATHNAME);

    await page.getByRole("button", { name: "More copy options" }).click();
    await page.getByRole("menuitem", { name: /Copy page as Markdown for LLMs/ }).click();

    await expect(page.getByRole("button", { name: "Page copied!" })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Page copied!" })).toHaveCount(1);

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.startsWith("Source: Catalunya 2022 - ")).toBe(true);
    expect(text).toContain(`\nURL: ${CANONICAL_URL}\n\n# ACTION 1.1\n`);
    expect(text).toContain("\n\n---\n\nHow to cite:\nGrup de Treball Catalunya 2022.\n");
    expect(text).toContain(`${CANONICAL_URL} · DOI: https://doi.org/`);
  });

  test("Open in ChatGPT and Claude carry the page markdown with its canonical URL", async ({ page }) => {
    await gotoStablePage(page, PATHNAME);

    await page.getByRole("button", { name: "More copy options" }).click();
    const chatgpt = page.getByRole("menuitem", { name: /Open in ChatGPT/ });
    const claude = page.getByRole("menuitem", { name: /Open in Claude/ });
    await expect(chatgpt).toBeVisible();
    await expect(claude).toBeVisible();

    const encodedUrl = encodeURIComponent(CANONICAL_URL);
    const encodedHeading = new URLSearchParams({ q: "# ACTION 1.1" }).toString().slice(2);
    await expect(chatgpt).toHaveAttribute("href", /^https:\/\/chatgpt\.com\/\?q=/);
    await expect(claude).toHaveAttribute("href", /^https:\/\/claude\.ai\/new\?q=/);
    for (const link of [chatgpt, claude]) {
      const href = (await link.getAttribute("href")) ?? "";
      expect(href).toContain(encodedUrl);
      expect(href).toContain(encodedHeading);
    }
  });
});
