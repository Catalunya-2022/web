import { describe, expect, it } from "vitest";
import { buildManifest } from "@/lib/metadata";
import { routing, type Locale } from "@/i18n/routing";

describe("buildManifest", () => {
  for (const locale of routing.locales) {
    describe(`locale: ${locale}`, () => {
      const manifest = buildManifest(locale as Locale);

      it("has required fields", () => {
        expect(manifest.name).toBeTruthy();
        expect(manifest.short_name).toBe("Catalunya 2022");
        expect(manifest.description).toBeTruthy();
        expect(manifest.display).toBe("browser");
        expect(manifest.lang).toBe(locale);
        expect(manifest.dir).toBe("ltr");
        expect(manifest.scope).toBe("/");
      });

      it("sets start_url based on locale prefix", () => {
        const expected = locale === routing.defaultLocale ? "/" : `/${locale}`;
        expect(manifest.start_url).toBe(expected);
      });

      it("has 3 icons including a maskable entry", () => {
        expect(manifest.icons).toHaveLength(3);
        const maskable = manifest.icons!.find(
          (i) => typeof i !== "string" && i.purpose === "maskable"
        );
        expect(maskable).toBeDefined();
      });

      it("uses the correct background and theme colors", () => {
        expect(manifest.background_color).toBe("#FFFFFF");
        expect(manifest.theme_color).toBe("#FFFFFF");
      });
    });
  }
});
