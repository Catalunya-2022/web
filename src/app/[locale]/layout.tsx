import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { OrientationTracker } from "@/components/content/orientation-card";
import { assertValidLocale } from "@/lib/content-utils";
import { resolveRouteLocale } from "@/lib/route-locale";
import { uiStrings } from "@/lib/ui-strings";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Reject unknown [locale] params with a 404 before generateMetadata runs.
// File-extension paths (e.g. /foo.png) skip the i18n middleware, so a missing
// asset lands here with locale="foo.png" — without this, resolveRouteLocale()
// throws inside generateMetadata and the response is a 500, not a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRouteLocale(params);
  const t = uiStrings[locale];
  return {
    description: t.homeDescription,
    manifest: `/manifest-${locale}.webmanifest`,
    appleWebApp: {
      capable: false,
      title: "Catalunya 2022",
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // Deliberately bypasses route-locale helpers: hasLocale() must guard before assertValidLocale().
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  assertValidLocale(locale);

  setRequestLocale(locale);

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell locale={locale}>{children}</AppShell>
        </ThemeProvider>
        <OrientationTracker />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="/js/pa.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
