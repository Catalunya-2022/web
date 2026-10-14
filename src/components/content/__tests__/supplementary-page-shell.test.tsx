// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { routing, type Locale } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";

vi.mock("@/components/content/nav-cards", () => ({ NavCards: () => null }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

function breadcrumbNames(): string[] {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const trail = scripts
    .map((script) => JSON.parse(script.textContent ?? "{}") as { "@type"?: string; itemListElement?: { name: string }[] })
    .find((data) => data["@type"] === "BreadcrumbList");
  return trail?.itemListElement?.map((item) => item.name) ?? [];
}

afterEach(cleanup);

describe("SupplementaryPageShell JSON-LD breadcrumb", () => {
  it.each(routing.locales as readonly Locale[])(
    "names the action plan URL with the same short label the hierarchy trails use (%s)",
    (locale) => {
      const t = uiStrings[locale];
      render(
        <SupplementaryPageShell slug="/action-plan" locale={locale} rawContent="raw">
          <p>child</p>
        </SupplementaryPageShell>
      );

      expect(breadcrumbNames()).toEqual([t.home, t.actionPlan]);
      expect(document.body.innerHTML).not.toContain(JSON.stringify(t.actionPlanTitle));
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(t.actionPlanTitle);
      const nav = screen.getByRole("navigation", { name: t.breadcrumbNav });
      expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual([t.home]);
    }
  );

  it("keeps the page title for pages whose navigation label is the title", () => {
    render(
      <SupplementaryPageShell slug="/organizations" locale="en" rawContent="raw">
        <p>child</p>
      </SupplementaryPageShell>
    );
    expect(breadcrumbNames()).toEqual([uiStrings.en.home, uiStrings.en.organizationsTitle]);
  });

  it("keeps the page title for every other supplementary page", () => {
    render(
      <SupplementaryPageShell slug="/mcp" locale="en" rawContent="raw">
        <p>child</p>
      </SupplementaryPageShell>
    );
    expect(breadcrumbNames()).toEqual([uiStrings.en.home, uiStrings.en.mcpTitle]);
  });
});
