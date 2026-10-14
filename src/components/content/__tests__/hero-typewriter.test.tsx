// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { HeroTypewriter } from "@/components/content/hero-typewriter";
import { heroItems } from "@/lib/data/hero-items";

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

describe("HeroTypewriter", () => {
  it("names the heading with the complete first sentence and hides the animated spans", () => {
    const { unmount } = render(<HeroTypewriter items={heroItems} locale="en" />);

    const heading = screen.getByRole("heading", { level: 1 });
    const sentence = `RESET: ${heroItems[0].text.en}`;
    expect(heading).toHaveAttribute("aria-label", sentence);
    expect(heading).toHaveAccessibleName(sentence);

    const spans = heading.querySelectorAll("span");
    expect(spans.length).toBeGreaterThanOrEqual(2);
    for (const span of spans) {
      expect(span).toHaveAttribute("aria-hidden", "true");
    }

    unmount();
  });
});
