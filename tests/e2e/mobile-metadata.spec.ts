import { expect, test } from "@playwright/test";
import { gotoStablePage } from "./helpers";

const LOCALES = [
  { locale: "en", path: "/en" },
  { locale: "es", path: "/es" },
  { locale: "ca", path: "/" },
] as const;

test.describe("PWA metadata and manifest", () => {
  for (const { locale, path } of LOCALES) {
    test(`${locale}: manifest link points to manifest-${locale}.json`, async ({ page }) => {
      await gotoStablePage(page, path);
      const href = await page.locator('link[rel="manifest"]').getAttribute("href");
      expect(href).toMatch(new RegExp(`manifest-${locale}\\.webmanifest$`));
    });

    test(`${locale}: apple-mobile-web-app-title is "Catalunya 2022"`, async ({ page }) => {
      await gotoStablePage(page, path);
      await expect(page.locator('meta[name="apple-mobile-web-app-title"]'))
        .toHaveAttribute("content", "Catalunya 2022");
    });

    test(`${locale}: does not emit mobile-web-app-capable`, async ({ page }) => {
      await gotoStablePage(page, path);
      await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveCount(0);
      await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveCount(0);
    });
  }

  test("manifest file returns valid JSON with correct shape", async ({ request }) => {
    const response = await request.get("/manifest-en.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.short_name).toBe("Catalunya 2022");
    expect(manifest.display).toBe("browser");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

    const maskable = manifest.icons.find(
      (i: { purpose?: string }) => i.purpose === "maskable"
    );
    expect(maskable).toBeDefined();
  });

  test("icon files return 200 with image/png", async ({ request }) => {
    for (const size of ["192", "512", "512-maskable"] as const) {
      const response = await request.get(`/icons/icon-${size}.png`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
    }
  });
});
