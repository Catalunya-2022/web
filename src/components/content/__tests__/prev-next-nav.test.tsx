// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { PrevNextNav } from "@/components/content/prev-next-nav";

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

describe("PrevNextNav", () => {
  it("names each link from its visible label and title only", () => {
    render(
      <PrevNextNav
        ariaLabel="Page navigation"
        prev={{ href: "/en/sphere-1/goal-1", label: "Previous", title: "Goal 1" }}
        next={{ href: "/en/sphere-1/goal-1/action-1-2", label: "Next", title: "Action 1.2" }}
      />,
    );

    const prev = screen.getByRole("link", { name: /Previous\s*Goal 1/ });
    const next = screen.getByRole("link", { name: /Next\s*Action 1\.2/ });
    expect(prev).not.toHaveAttribute("aria-label");
    expect(next).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("navigation", { name: "Page navigation" })).toContainElement(prev);
  });
});
