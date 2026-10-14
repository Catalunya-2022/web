import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { isRewrite, getRewrittenUrl } from "next/experimental/testing/server";
// proxy.ts lives at web/src/proxy.ts (top-level), not in web/src/lib/
import proxy from "../../proxy";
import { routing } from "@/i18n/routing";

function makeRequest(
  pathname: string,
  init: { cookie?: string; acceptLanguage?: string; origin?: string } = {}
) {
  const url = new URL(`${init.origin ?? "https://2022.cat"}${pathname}`);
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

  describe("internal locale path", () => {
    it("rewrites the pathless CA root to /ca and a CA slug under /ca", () => {
      expect(new URL(getRewrittenUrl(proxy(makeRequest("/")))!).pathname).toBe("/ca");
      expect(new URL(getRewrittenUrl(proxy(makeRequest("/introduccio")))!).pathname).toBe(
        "/ca/introduction",
      );
    });

    it("rewrites prefixed roots and slugs under their own locale", () => {
      expect(new URL(getRewrittenUrl(proxy(makeRequest("/en")))!).pathname).toBe("/en");
      expect(new URL(getRewrittenUrl(proxy(makeRequest("/es/introduccion")))!).pathname).toBe(
        "/es/introduction",
      );
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

  // Unprefixed EN/ES hierarchy forms were never public URLs; they fall through
  // to next-intl like any unknown path and 404 at the router.
  describe("non-CA hierarchy without prefix falls through", () => {
    it("/sphere-1 is not redirected", () => {
      const res = proxy(makeRequest("/sphere-1"));
      expect([301, 302, 307, 308]).not.toContain(res.status);
    });

    it("/ambito-1/objetivo-4/accion-4-3 is not redirected", () => {
      const res = proxy(makeRequest("/ambito-1/objetivo-4/accion-4-3"));
      expect([301, 302, 307, 308]).not.toContain(res.status);
    });
  });

  // NEXT_LOCALE is written in three places (next-intl's localeCookie, this
  // proxy, the language switcher's client helper); their attributes must agree
  // or a switch can be undone by the next response. See
  // docs/solutions/i18n-issues/next-intl-middleware-overrides-locale-cookie.md.
  describe("NEXT_LOCALE cookie writer", () => {
    it("sets a Secure, Lax, site-wide cookie over https when none matches", () => {
      const res = proxy(makeRequest("/en/introduction"));
      const cookie = res.cookies.get("NEXT_LOCALE");

      expect(isRewrite(res)).toBe(true);
      expect(cookie).toMatchObject({ value: "en", path: "/", sameSite: "lax", secure: true });
      expect(cookie?.maxAge).toBeUndefined();
    });

    it("omits Secure over plain http, so a local next start keeps the cookie in every browser", () => {
      const res = proxy(makeRequest("/es/introduccion", { origin: "http://127.0.0.1:3201" }));

      expect(res.cookies.get("NEXT_LOCALE")).toMatchObject({ value: "es", secure: false });
    });

    it("leaves the cookie alone when it already carries the request's locale", () => {
      const res = proxy(makeRequest("/en/introduction", { cookie: "NEXT_LOCALE=en" }));

      expect(res.cookies.get("NEXT_LOCALE")).toBeUndefined();
    });

    it("keys next-intl's own cookie Secure flag on the production build, not the protocol", () => {
      expect(routing.localeCookie).toEqual({ secure: process.env.NODE_ENV === "production" });
    });
  });
});
