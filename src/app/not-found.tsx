import type { Metadata } from "next";
import { NotFoundContent } from "@/components/content/not-found-content";
import { NotFoundTracker } from "@/components/content/not-found-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import { inter, outfit } from "@/lib/fonts";
import { uiStrings } from "@/lib/ui-strings";

export const metadata: Metadata = {
  title: uiStrings.ca.notFoundHeading,
  robots: null,
};

/**
 * Serves virtually every bad URL (dynamicParams is false on every dynamic
 * route), prerendered as /_not-found with a real 404 status and no-store.
 * It renders outside the locale layout, so it owns its <html>: Catalan on the
 * server, re-rendered in the URL's language by NotFoundContent after
 * hydration. Fonts and theme match the locale layout.
 */
export default function NotFound() {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NotFoundTracker />
          <NotFoundContent initialLocale="ca" />
        </ThemeProvider>
      </body>
    </html>
  );
}
