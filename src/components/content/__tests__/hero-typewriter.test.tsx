// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

type HeroWindow = Window & { __CATALUNYA_HERO_INDEX__?: number };

afterEach(() => {
  delete (window as HeroWindow).__CATALUNYA_HERO_INDEX__;
});

describe("HeroTypewriter", () => {
  it("starts from the item the pre-hydration script chose, fully typed, with its link", () => {
    (window as HeroWindow).__CATALUNYA_HERO_INDEX__ = 3;
    const { unmount } = render(<HeroTypewriter items={heroItems} locale="en" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("aria-label", `RESET: ${heroItems[3].text.en}`);
    expect(heading).toHaveTextContent(heroItems[3].text.en);
    expect(screen.getByText(heroItems[3].label.en).closest("a")).toHaveAttribute("href", `/en${heroItems[3].slug}`);

    unmount();
  });

  it("ignores an out-of-range or missing index and starts from item 0", () => {
    (window as HeroWindow).__CATALUNYA_HERO_INDEX__ = 99;
    const { unmount } = render(<HeroTypewriter items={heroItems} locale="ca" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("aria-label", `RESET: ${heroItems[0].text.ca}`);

    unmount();
  });

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
