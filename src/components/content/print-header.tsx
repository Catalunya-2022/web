import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

export function PrintHeader({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  return (
    <div className="hidden border-t-2 border-red-600 pt-4 pb-6 print:block">
      <p className="font-heading text-lg font-bold">Catalunya 2022</p>
      <p className="text-sm text-muted-foreground">RESET: {t.tagline}</p>
    </div>
  );
}
