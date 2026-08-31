import { MobileBreadcrumbBar } from "@/components/layout/mobile-breadcrumb-bar";
import { WebMcpTools } from "@/components/layout/webmcp-tools";
import { CopyPageProvider } from "@/components/content/copy-page-context";
import type { Locale } from "@/i18n/routing";

export function ContentArea({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <CopyPageProvider>
      {/* tabIndex lets the skip link actually move focus here (Safari). */}
      <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col pt-14 outline-none">
        <MobileBreadcrumbBar locale={locale} />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[960px] px-6 pt-16 pb-5 md:px-16 md:pt-10 md:pb-10">
            {children}
          </div>
        </div>
      </div>
      <WebMcpTools locale={locale} />
    </CopyPageProvider>
  );
}
