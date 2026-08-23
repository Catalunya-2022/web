import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Reciprocal hreflang Link headers for the trilingual document downloads —
// Google's documented method for non-HTML files. Every variant must list the
// whole cluster (asymmetric annotations get ignored).
const DOCUMENT_HREFLANG_FAMILIES: Array<{ base: string; ext: string; locales: string[] }> = [
  { base: "catalunya-2022", ext: "pdf", locales: ["ca", "en", "es"] },
  { base: "catalunya-2022", ext: "epub", locales: ["ca", "en", "es"] },
  { base: "catalunya-2022", ext: "md", locales: ["ca", "en", "es"] },
  { base: "acord-de-govern", ext: "pdf", locales: ["ca", "es"] },
];

function documentHreflangRules() {
  return DOCUMENT_HREFLANG_FAMILIES.flatMap(({ base, ext, locales }) => {
    const link = locales
      .map(
        (locale) =>
          `<https://2022.cat/documents/${base}-${locale}.${ext}>; rel="alternate"; hreflang="${locale}"`,
      )
      .join(", ");
    return locales.map((locale) => ({
      source: `/documents/${base}-${locale}.${ext}`,
      headers: [{ key: "Link", value: link }],
    }));
  });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Source photos never change in place; a filename change accompanies any
    // replacement, so optimized variants can carry a long browser TTL.
    minimumCacheTTL: 2678400,
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
          // Mirrors the robots.txt Content-Signal policy on every response;
          // Cloudflare treats an origin-sent header as authoritative.
          { key: "Content-Signal", value: "search=yes, ai-input=yes, ai-train=yes" },
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
      {
        // Portraits and OG-generation fonts never change under the same name.
        source: "/team-photos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Content-addressed filenames (FNV-1a hash), safe to cache forever.
        source: "/press-favicons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Regenerated per deploy under stable URLs: long TTL, not immutable.
        source: "/og/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/press-images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/documents/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      ...documentHreflangRules(),
      {
        // Per-page markdown mirrors are an agent surface, not a search
        // surface: keep them out of the index so they never compete with
        // their HTML pages as duplicates.
        source: "/:path(.*\\.md)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // The full-document downloads stay indexable (they are user-facing
        // downloads clustered by the hreflang Link headers above). A later
        // rule with the same key overrides the earlier match.
        source: "/documents/:path(.*\\.md)",
        headers: [{ key: "X-Robots-Tag", value: "all" }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
