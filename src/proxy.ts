import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing, type Locale } from "./i18n/routing";
import { detectLocale, resolveRoute } from "@/lib/path-utils";

const intlMiddleware = createMiddleware(routing);
const LOCALE_HEADER = "X-NEXT-INTL-LOCALE";
const LOCALIZED_ROUTE_HEADER = "X-CATALUNYA-LOCALIZED-ROUTE";

function buildInternalLocalePath(canonical: string, locale: Locale) {
  return canonical === "/" ? `/${locale}` : `/${locale}${canonical}`;
}

function setLocaleCookie(response: NextResponse, request: NextRequest, locale: Locale) {
  const current = request.cookies.get("NEXT_LOCALE")?.value;
  if (current === locale) return;

  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
}

function rewriteToInternal(
  request: NextRequest,
  requestHeaders: Headers,
  canonical: string,
  locale: Locale,
): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = buildInternalLocalePath(canonical, locale);

  requestHeaders.set(LOCALIZED_ROUTE_HEADER, "1");

  const response = NextResponse.rewrite(target, {
    request: { headers: requestHeaders },
  });
  setLocaleCookie(response, request, locale);
  return response;
}

/** Paths with file extensions (e.g. /foo.pdf) are static assets, not routes.
 *  Let Next.js serve them directly — they'll 404 if not found in /public. */
const FILE_EXT_RE = /\.[a-z0-9]{1,20}$/i;

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for file-extension URLs to prevent [locale] catch-all from matching
  if (FILE_EXT_RE.test(pathname)) {
    return NextResponse.next();
  }

  // Well-known URIs (RFC 8615) are machine endpoints served from /public —
  // never localized routes. Some (e.g. /.well-known/api-catalog) have no file
  // extension, so they need an explicit skip or i18n rewriting would 404 them.
  if (pathname.startsWith("/.well-known/")) {
    return NextResponse.next();
  }

  const locale = detectLocale(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  // Defense in depth: a request already rewritten from a localized route must never be redirected back out.
  if (request.headers.get(LOCALIZED_ROUTE_HEADER) === "1") {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    setLocaleCookie(response, request, locale);
    return response;
  }

  const resolution = resolveRoute(pathname, locale);
  if (resolution) {
    switch (resolution.kind) {
      case "localized":
        return rewriteToInternal(
          request,
          requestHeaders,
          resolution.canonical,
          resolution.locale,
        );
      case "hierarchy-ca":
        // CA pathless hierarchy (/ambit-1, /ambit-1/objectiu-2, ...) → rewrite
        // internally to /ca/<pathname> so Next.js can resolve [locale]=ca.
        return rewriteToInternal(request, requestHeaders, pathname, "ca");
      default: {
        // Exhaustiveness guard: a new RouteResolution kind without a case arm fails typecheck here.
        const _exhaustive: never = resolution;
        throw new Error(`Unhandled route kind: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }

  // Unknown path — let next-intl handle it.
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel).*)"],
};
