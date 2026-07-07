import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { ROUTE_CATALOG, SEGMENT_PREFIXES } from "./src/lib/route-catalog";

/** next-intl bracket segments ([member]) → path-to-regexp params (:member). */
function toPathPattern(pattern: string) {
  return pattern.replace(/\[(\w+)\]/g, ":$1");
}

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Legacy canonical-English CA URLs (e.g. /introduction) predate the
    // translated slugs and fall through to next-intl, which redirects them to
    // the translated slug with a 307 (temporary) — telling search engines to
    // keep the old URL. Redirect them permanently here instead (this runs
    // before the middleware). Derived from ROUTE_CATALOG so the slugs can't
    // drift. Hierarchy routes (/sphere-1, …) already get an explicit 301 in
    // proxy.ts.
    const legacyCatalogRedirects = Object.values(ROUTE_CATALOG)
      .filter((patterns) => patterns.en !== patterns.ca)
      .map((patterns) => ({
        source: toPathPattern(patterns.en),
        destination: toPathPattern(patterns.ca),
        permanent: true,
      }));

    // Legacy ES URLs (before the translated-slug migration) used English
    // slugs under /es (e.g.
    // /es/executive-summary). Catalog forms fell through to next-intl's 307;
    // hierarchy forms (/es/sphere-1/…) 404ed outright. Both were live and
    // crawlable before the slug migration, so redirect them permanently to
    // the translated ES URLs.
    const esLegacyCatalogRedirects = Object.values(ROUTE_CATALOG)
      .filter((patterns) => patterns.en !== patterns.es)
      .map((patterns) => ({
        source: `/es${toPathPattern(patterns.en)}`,
        destination: `/es${toPathPattern(patterns.es)}`,
        permanent: true,
      }));

    const { sphere, goal, action } = SEGMENT_PREFIXES;
    const esLegacyHierarchyRedirects = [
      {
        source: `/es/${sphere.en}-:sphere`,
        destination: `/es/${sphere.es}-:sphere`,
      },
      {
        source: `/es/${sphere.en}-:sphere/${goal.en}-:goal`,
        destination: `/es/${sphere.es}-:sphere/${goal.es}-:goal`,
      },
      {
        source: `/es/${sphere.en}-:sphere/${goal.en}-:goal/${action.en}-:action`,
        destination: `/es/${sphere.es}-:sphere/${goal.es}-:goal/${action.es}-:action`,
      },
    ].map((redirect) => ({ ...redirect, permanent: true }));

    return [
      ...legacyCatalogRedirects,
      ...esLegacyCatalogRedirects,
      ...esLegacyHierarchyRedirects,
      // CA is pathless, so an explicit /ca prefix is never a public URL;
      // next-intl strips it with a 307 — consolidate permanently instead.
      { source: "/ca", destination: "/", permanent: true },
      { source: "/ca/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // CSP only in production — Turbopack dev uses eval/blob for HMR which CSP blocks
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Content-Security-Policy",
                  // App Router static pages emit inline runtime, structured-data, and theme bootstrap scripts.
                  // Keep inline <script> elements for the static build, but block inline script attributes.
                  value: [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline'",
                    "script-src-attr 'none'",
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data:",
                    "font-src 'self'",
                    "frame-src https://www.youtube-nocookie.com",
                    "connect-src 'self'",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self'",
                    "manifest-src 'self'",
                    "frame-ancestors 'none'",
                    "upgrade-insecure-requests",
                  ].join("; "),
                },
              ]
            : []),
        ],
      },
      {
        // RFC 8288/9727 agent-discovery pointer; inert for browsers (no
        // preload/preconnect rel), so zero effect on human visitors.
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</.well-known/api-catalog>; rel="api-catalog"',
          },
        ],
      },
      {
        // RFC 9727 requires application/linkset+json; the file is served from
        // /public without an extension, so set the type explicitly.
        source: "/.well-known/api-catalog",
        headers: [
          { key: "Content-Type", value: "application/linkset+json" },
        ],
      },
      {
        source: "/search-corpus-:locale(ca|en|es).json",
        headers: [
          {
            key: "Cache-Control",
            // Corpus filenames stay stable across deploys, so prefer a short TTL over immutable caching.
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/manifest-:locale(ca|en|es).webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/documents/:path*.epub",
        headers: [
          { key: "Content-Type", value: "application/epub+zip" },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
