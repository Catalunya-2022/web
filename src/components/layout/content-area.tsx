import { MobileBreadcrumbBar } from "@/components/layout/mobile-breadcrumb-bar";
import { CopyPageProvider } from "@/components/content/copy-page-context";
import type { Locale } from "@/i18n/routing";

export function ContentArea({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <CopyPageProvider>
      <div id="main-content" className="flex flex-1 flex-col pt-14">
        <MobileBreadcrumbBar locale={locale} />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[960px] px-6 pt-16 pb-5 md:px-16 md:pt-10 md:pb-10">
            {children}
          </div>
        </div>
      </div>
    </CopyPageProvider>
  );
}
