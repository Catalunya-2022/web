import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";
import { ContentArea } from "@/components/layout/content-area";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import { getNavigation } from "@/lib/navigation-server";

export async function AppShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const t = uiStrings[locale];
  const nav = await getNavigation(locale);

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only print:hidden focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        {t.skipToContent}
      </a>

      <TopBar locale={locale} />
      <SidebarNav locale={locale} nav={nav} />
      <SidebarInset>
        <ContentArea locale={locale}>{children}</ContentArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
