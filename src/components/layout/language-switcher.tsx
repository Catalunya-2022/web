"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Languages, Check } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localizeHref, toCanonicalPath } from "@/lib/path-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ca", label: "Català" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

function setCookie(name: string, value: string) {
  // Secure only over HTTPS — on plain-HTTP localhost the browser would drop
  // the cookie and the language choice would not persist.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax${secure}`;
}

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const rawPathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLabel =
    LOCALES.find((l) => l.code === currentLocale)?.label ?? currentLocale;

  function handleSwitch(locale: Locale) {
    if (locale === currentLocale) return;
    const canonical = toCanonicalPath(rawPathname);
    const targetHref = localizeHref(canonical, locale);
    setCookie("NEXT_LOCALE", locale);
    startTransition(() => {
      router.push(targetHref);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:opacity-50"
      >
        <Languages className="size-4 shrink-0 opacity-50" />
        <span>{currentLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[130px]">
        {LOCALES.map(({ code, label }) => {
          const isActive = code === currentLocale;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => handleSwitch(code)}
              className="flex items-center justify-between text-sm"
              lang={code}
            >
              <span>{label}</span>
              {isActive && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
