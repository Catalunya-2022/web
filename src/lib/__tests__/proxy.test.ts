import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  isRewrite,
  getRewrittenUrl,
  getRedirectUrl,
} from "next/experimental/testing/server";
// proxy.ts lives at web/src/proxy.ts (top-level), not in web/src/lib/
import proxy from "../../proxy";

function makeRequest(
  pathname: string,
  init: { cookie?: string; acceptLanguage?: string } = {}
) {
  const url = new URL(`https://2022.cat${pathname}`);
  const headers = new Headers();
  if (init.acceptLanguage) headers.set("accept-language", init.acceptLanguage);
  if (init.cookie) headers.set("cookie", init.cookie);
  return new NextRequest(url, { headers });
}

describe("proxy middleware", () => {
  // Regression — no HTTP Link header with hreflang on hierarchy pages
  describe("hierarchy routes", () => {
    it("[regression] /en/sphere-1/goal-4/action-4-3 has no hreflang Link header", () => {
      const res = proxy(
        makeRequest("/en/sphere-1/goal-4/action-4-3", {
          acceptLanguage: "en-US,en;q=0.9",
        }),
      );
      // After alternateLinks: false, no Link header with hreflang should be set.
      const hasHreflangLink =
        res.headers.has("link") && res.headers.get("link")!.includes("hreflang");
      expect(hasHreflangLink).toBe(false);
    });
  });

  // Regression — dynamic catalog route + foreign Accept-Language / cookie
  // Before the fix, the proxy's isLocalizedStaticRoute predicate failed for
  // /task-force/[member] (ROUTE_KEYS had the literal template, not the substituted
  // slug), so the request fell through to intlMiddleware which 307-redirected to
  // /en/task-force/... based on Accept-Language. The new resolveLocalizedRoute
  // helper walks PARSED_CATALOG properly and catches the dynamic route.
  describe("dynamic CA routes", () => {
    it("[regression] /grup-de-treball/<member> + Accept-Language: en stays on CA", () => {
      const res = proxy(
        makeRequest("/grup-de-treball/victoria-alsina", {
          acceptLanguage: "en-US,en;q=0.9",
        }),
      );
      expect(isRewrite(res)).toBe(true);
      const rewritten = getRewrittenUrl(res);
      expect(rewritten).not.toBeNull();
      expect(rewritten!).toContain("/ca/task-force/victoria-alsina");
      expect(res.cookies.get("NEXT_LOCALE")?.value).toBe("ca");
    });

    it("[regression] /grup-de-treball/<member> + NEXT_LOCALE=en cookie stays on CA", () => {
      const res = proxy(
        makeRequest("/grup-de-treball/victoria-alsina", {
          cookie: "NEXT_LOCALE=en",
        }),
      );
      expect(isRewrite(res)).toBe(true);
      const rewritten = getRewrittenUrl(res);
      expect(rewritten).not.toBeNull();
      expect(rewritten!).toContain("/ca/task-force/victoria-alsina");
    });

    it("/grup-de-treball static listing + Accept-Language: en also stays on CA (no regression)", () => {
      const res = proxy(
        makeRequest("/grup-de-treball", {
          acceptLanguage: "en-US,en;q=0.9",
        }),
      );
      expect(isRewrite(res)).toBe(true);
      const rewritten = getRewrittenUrl(res);
      expect(rewritten).not.toBeNull();
      expect(rewritten!).toContain("/ca/task-force");
    });
  });

  // resolveRoute — hierarchy-ca branch
  describe("CA hierarchy intercept (hierarchy-ca kind)", () => {
    it("/ambit-1/objectiu-2 + Accept-Language: en stays on CA (rewrite, not 307)", () => {
      const res = proxy(
        makeRequest("/ambit-1/objectiu-2", {
          acceptLanguage: "en-US,en;q=0.9",
        }),
      );
      expect(isRewrite(res)).toBe(true);
      const rewritten = getRewrittenUrl(res);
      expect(rewritten).not.toBeNull();
      expect(rewritten!).toContain("/ca/ambit-1/objectiu-2");
      expect(res.cookies.get("NEXT_LOCALE")?.value).toBe("ca");
    });
  });

  // resolveRoute — hierarchy-redirect branch
  describe("non-CA hierarchy without prefix (hierarchy-redirect kind)", () => {
    it("/sphere-1 → 301 → /en/sphere-1", () => {
      const res = proxy(makeRequest("/sphere-1"));
      expect(res.status).toBe(301);
      const redirectUrl = getRedirectUrl(res);
      expect(redirectUrl).not.toBeNull();
      expect(redirectUrl!).toContain("/en/sphere-1");
    });

    it("/ambito-1/objetivo-4/accion-4-3 → 301 → /es/ambito-1/objetivo-4/accion-4-3", () => {
      const res = proxy(makeRequest("/ambito-1/objetivo-4/accion-4-3"));
      expect(res.status).toBe(301);
      const redirectUrl = getRedirectUrl(res);
      expect(redirectUrl).not.toBeNull();
      expect(redirectUrl!).toContain("/es/ambito-1/objetivo-4/accion-4-3");
    });
  });
});
