"use client";

import { useSyncExternalStore } from "react";
import { Moon, Monitor, Smartphone, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";

const subscribe = () => () => {};

export function ThemeToggle({ locale, variant = "desktop" }: { locale: Locale; variant?: "desktop" | "mobile" }) {
  const t = uiStrings[locale];
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  // Use `theme` (raw preference) not `resolvedTheme` so System stays
  // selected even when the OS resolves to dark or light.
  const preference = mounted ? (theme ?? "system") : "system";
  const isLight  = preference === "light";
  const isSystem = preference === "system";
  const isDark   = preference === "dark";

  const activeClass   = "bg-background text-foreground shadow-sm";
  const inactiveClass = "text-muted-foreground hover:text-foreground";

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
      role="radiogroup"
      aria-label={t.colorTheme}
    >
      <button
        role="radio"
        aria-checked={isLight}
        aria-label={t.lightMode}
        onClick={() => setTheme("light")}
        className={`flex size-7 items-center justify-center rounded-md transition-all ${isLight ? activeClass : inactiveClass}`}
      >
        <Sun className="size-[15px]" />
      </button>
      <button
        role="radio"
        aria-checked={isSystem}
        aria-label={t.systemMode}
        onClick={() => setTheme("system")}
        className={`flex size-7 items-center justify-center rounded-md transition-all ${isSystem ? activeClass : inactiveClass}`}
      >
        {variant === "mobile" ? <Smartphone className="size-[15px]" /> : <Monitor className="size-[15px]" />}
      </button>
      <button
        role="radio"
        aria-checked={isDark}
        aria-label={t.darkMode}
        onClick={() => setTheme("dark")}
        className={`flex size-7 items-center justify-center rounded-md transition-all ${isDark ? activeClass : inactiveClass}`}
      >
        <Moon className="size-[15px]" />
      </button>
    </div>
  );
}
