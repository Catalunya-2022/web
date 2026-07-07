// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { NavSection } from "@/lib/navigation-server";

const usePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/layout/language-switcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

vi.mock("@/components/layout/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

const nav: NavSection[] = [
  {
    items: [{ slug: "/", title: "Home" }],
  },
  {
    items: [
      {
        slug: "/action-plan",
        title: "Action Plan",
        children: [
          {
            slug: "/sphere-1",
            title: "Sphere 1",
            children: [
              {
                slug: "/sphere-1/goal-1",
                title: "Goal 1",
                children: [
                  {
                    slug: "/sphere-1/goal-1/action-1-1",
                    title: "Action 1.1",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

function renderSidebar(pathname = "/action-plan") {
  usePathname.mockReturnValue(`/en${pathname}`);

  return render(
    <SidebarProvider>
      <SidebarNav locale="en" nav={nav} />
    </SidebarProvider>
  );
}

describe("SidebarNav", () => {
  it("does not nest interactive controls inside each other", () => {
    const { container } = renderSidebar();

    expect(container.querySelector("button a, a button")).toBeNull();
  });

  it("uses separate disclosure buttons for collapsible rows", async () => {
    renderSidebar();
    const user = userEvent.setup();

    expect(screen.queryByRole("link", { name: "Goal 1" })).not.toBeInTheDocument();

    const sphereLink = screen.getAllByRole("link", { name: "Sphere 1" })[0];
    expect(sphereLink).toHaveAttribute("href", "/en/sphere-1");

    const sphereToggle = screen.getAllByRole("button", { name: "Sphere 1" })[0];
    await user.click(sphereToggle);

    const goalLink = (await screen.findAllByRole("link", { name: "Goal 1" }))[0];
    expect(goalLink).toHaveAttribute("href", "/en/sphere-1/goal-1");

    const goalToggle = screen.getAllByRole("button", { name: "Goal 1" })[0];
    await user.click(goalToggle);

    expect(
      (await screen.findAllByRole("link", { name: "Action 1.1" }))[0]
    ).toHaveAttribute("href", "/en/sphere-1/goal-1/action-1-1");
  });
});
