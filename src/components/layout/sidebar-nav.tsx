"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/icons/brand-logo";
import {
  Home,
  FileText,
  BookOpen,
  Users,
  Lightbulb,
  Building2,
  Newspaper,
  UserCheck,
  Globe,
  FolderOpen,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
/* No ScrollArea here: SidebarContent already scrolls (overflow-auto);
   nesting a second scroll context causes active-bg bleed. */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { NavItem, NavSection } from "@/lib/navigation-server";
import { uiStrings } from "@/lib/ui-strings";
import type { Locale } from "@/i18n/routing";
import { localizeHref, toCanonicalPath } from "@/lib/path-utils";
import { cn } from "@/lib/utils";

const itemIcons: Record<string, React.ElementType> = {
  "/": Home,
  "/introduction": BookOpen,
  "/action-plan": ClipboardList,
  "/executive-summary": FileText,
  "/train-of-prosperity": BookOpen,
  "/sphere-1": Users,
  "/sphere-2": Lightbulb,
  "/sphere-3": Building2,
  "/task-force": UserCheck,
  "/people-consulted": Users,
  "/organizations": Globe,
  "/press": Newspaper,
  "/resources": FolderOpen,
};

const activeClass =
  "!bg-[oklch(0.97_0.01_16)] !text-primary !font-semibold dark:!bg-[oklch(0.2_0.02_16)]";

function NavLink({
  item,
  pathname,
  locale,
}: {
  item: NavItem;
  pathname: string;
  locale: Locale;
}) {
  const isActive = pathname === item.slug;
  const Icon = itemIcons[item.slug];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={isActive ? activeClass : ""}
      >
        <Link href={localizeHref(item.slug, locale)} aria-current={isActive ? "page" : undefined}>
          {Icon && (
            <Icon
              className={`size-4 shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`}
            />
          )}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Collapsible open state that re-syncs to the route: manual toggles persist
 * until navigation makes `shouldBeOpen` change, which wins. Adjusted during
 * render (React's "adjusting state when a prop changes" pattern) rather than
 * in an effect, so the sync paints together with the navigation.
 */
function useSyncedOpen(shouldBeOpen: boolean) {
  const [open, setOpen] = useState(shouldBeOpen);
  const [prevShouldBeOpen, setPrevShouldBeOpen] = useState(shouldBeOpen);
  if (prevShouldBeOpen !== shouldBeOpen) {
    setPrevShouldBeOpen(shouldBeOpen);
    setOpen(shouldBeOpen);
  }
  return [open, setOpen] as const;
}

function GoalCollapsible({
  goal,
  pathname,
  locale,
}: {
  goal: NavItem;
  pathname: string;
  locale: Locale;
}) {
  const isGoalActive = pathname === goal.slug;
  const isChildActive = goal.children?.some((a) => pathname === a.slug) ?? false;
  const shouldBeOpen = isGoalActive || isChildActive;
  const [open, setOpen] = useSyncedOpen(shouldBeOpen);

  const hasChildren = (goal.children?.length ?? 0) > 0;

  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <SidebarMenuItem className="group/goal">
        <SidebarMenuButton
          asChild
          isActive={isGoalActive}
          className={cn(hasChildren && "pr-8", isGoalActive && activeClass)}
        >
          <Link
            href={localizeHref(goal.slug, locale)}
            aria-current={isGoalActive ? "page" : undefined}
          >
            <span>{goal.title}</span>
          </Link>
        </SidebarMenuButton>
        {hasChildren && (
          <CollapsibleTrigger asChild>
            <SidebarMenuAction aria-label={goal.title}>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  open && "rotate-90"
                )}
              />
            </SidebarMenuAction>
          </CollapsibleTrigger>
        )}
        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {goal.children!.map((action) => {
                const isActive = pathname === action.slug;
                return (
                  <SidebarMenuSubItem key={action.slug}>
                    <SidebarMenuSubButton
                      asChild
                      size="sm"
                      isActive={isActive}
                      className={isActive ? "!text-primary !font-semibold" : ""}
                    >
                      <Link
                        href={localizeHref(action.slug, locale)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span>{action.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SphereCollapsible({
  sphere,
  pathname,
  locale,
}: {
  sphere: NavItem;
  pathname: string;
  locale: Locale;
}) {
  const isSphereActive = pathname === sphere.slug;
  const isDescendantActive =
    sphere.children?.some(
      (goal) =>
        pathname === goal.slug ||
        goal.children?.some((a) => pathname === a.slug)
    ) ?? false;
  const shouldBeOpen = isSphereActive || isDescendantActive;
  const [open, setOpen] = useSyncedOpen(shouldBeOpen);
  const Icon = itemIcons[sphere.slug];

  const hasChildren = (sphere.children?.length ?? 0) > 0;

  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <SidebarMenuItem className="group/sphere">
        <SidebarMenuButton
          asChild
          isActive={isSphereActive}
          className={cn(hasChildren && "pr-8", isSphereActive && activeClass)}
        >
          <Link
            href={localizeHref(sphere.slug, locale)}
            aria-current={isSphereActive ? "page" : undefined}
          >
            {Icon && (
              <Icon
                className={`size-4 shrink-0 ${isSphereActive ? "opacity-100" : "opacity-50"}`}
                aria-hidden="true"
              />
            )}
            <span>{sphere.title}</span>
          </Link>
        </SidebarMenuButton>
        {hasChildren && (
          <CollapsibleTrigger asChild>
            <SidebarMenuAction aria-label={sphere.title}>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  open && "rotate-90"
                )}
              />
            </SidebarMenuAction>
          </CollapsibleTrigger>
        )}
        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {sphere.children!.map((goal) => (
                <GoalCollapsible
                  key={goal.slug}
                  goal={goal}
                  pathname={pathname}
                  locale={locale}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function ActionPlanNav({
  item,
  pathname,
  locale,
}: {
  item: NavItem;
  pathname: string;
  locale: Locale;
}) {
  const isActive = pathname === item.slug;
  const Icon = itemIcons[item.slug];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={isActive ? activeClass : ""}
      >
        <Link href={localizeHref(item.slug, locale)} aria-current={isActive ? "page" : undefined}>
          {Icon && (
            <Icon
              className={`size-4 shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`}
              aria-hidden="true"
            />
          )}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.children && item.children.length > 0 && (
        <SidebarMenuSub>
          {item.children.map((sphere) => (
            <SphereCollapsible
              key={sphere.slug}
              sphere={sphere}
              pathname={pathname}
              locale={locale}
            />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function SidebarNav({
  locale,
  nav,
}: {
  locale: Locale;
  nav: NavSection[];
}) {
  const rawPathname = usePathname();
  const pathname = toCanonicalPath(rawPathname);
  const { setOpenMobile } = useSidebar();
  const t = uiStrings[locale];

  // Auto-close mobile Sheet on navigation
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sidebar sheetTitle={t.navigation} sheetDescription={t.navigation} closeLabel={t.close}>
      <SidebarHeader className="border-b p-3 md:hidden">
        <Link href={localizeHref("/", locale)} className="flex items-center gap-2">
          <BrandLogo size="sm" />
        </Link>
        <div className="flex items-center justify-between">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle locale={locale} variant="mobile" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((section, idx) => (
          <div key={section.items[0]?.slug ?? `section-${idx}`}>
            {idx > 0 && <SidebarSeparator />}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) =>
                    item.children ? (
                      <ActionPlanNav
                        key={item.slug}
                        item={item}
                        pathname={pathname}
                        locale={locale}
                      />
                    ) : (
                      <NavLink
                        key={item.slug}
                        item={item}
                        pathname={pathname}
                        locale={locale}
                      />
                    )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="hidden border-t md:flex">
        <div className="flex items-center justify-between">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle locale={locale} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
