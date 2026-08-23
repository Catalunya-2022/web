// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OrientationCard, OrientationTracker } from "@/components/content/orientation-card";

let pathname = "/en/sphere-1/goal-2/action-2-1";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const ENTRY_KEY = "c22-session-entry";
const DISMISSED_KEY = "c22-orientation-dismissed";
const OVERVIEW_SEEN_KEY = "c22-overview-seen";

function setPath(path: string) {
  pathname = path;
  window.history.replaceState(null, "", path);
}

/** The card decides its visibility one animation frame after mount. */
async function flushAnimationFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

afterEach(cleanup);

describe("OrientationCard", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    setPath("/en/sphere-1/goal-2/action-2-1");
  });

  it("shows on a deep external landing and adapts the copy to the page type", async () => {
    // jsdom has an empty document.referrer, which counts as external arrival.
    render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);

    const card = await screen.findByRole("complementary");
    expect(card.textContent).toContain("one of the 91 actions");
    expect(card.textContent).toContain("Catalunya 2022 - RESET: Call to reactivate Catalonia");
    expect(screen.getByRole("link", { name: "introduction" })).toHaveAttribute(
      "href",
      "/en/introduction"
    );
    expect(screen.getByRole("link", { name: "executive summary" })).toHaveAttribute(
      "href",
      "/en/executive-summary"
    );
    expect(sessionStorage.getItem(ENTRY_KEY)).toBe("deep");
  });

  it("uses the goal wording and localized links on a Catalan goal page", async () => {
    setPath("/ambit-1/objectiu-2");
    render(<OrientationCard slug="/sphere-1/goal-2" locale="ca" />);

    const card = await screen.findByRole("complementary");
    expect(card.textContent).toContain("un dels 12 objectius");
    expect(card.textContent).toContain("Crida per reactivar el país");
    expect(screen.getByRole("link", { name: "introducció" })).toHaveAttribute(
      "href",
      "/introduccio"
    );
  });

  it("stays hidden for bots and automated browsers", async () => {
    const original = Object.getOwnPropertyDescriptor(window.navigator, "webdriver");
    Object.defineProperty(window.navigator, "webdriver", {
      value: true,
      configurable: true,
    });
    try {
      render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);
      await flushAnimationFrame();
      expect(screen.queryByRole("complementary")).toBeNull();
    } finally {
      if (original) {
        Object.defineProperty(window.navigator, "webdriver", original);
      } else {
        delete (window.navigator as { webdriver?: boolean }).webdriver;
      }
    }
  });

  it("stays hidden when the session did not start on a deep page", async () => {
    sessionStorage.setItem(ENTRY_KEY, "other");
    render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);

    await flushAnimationFrame();
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("stays hidden once the visitor has seen an overview page", async () => {
    sessionStorage.setItem(ENTRY_KEY, "deep");
    localStorage.setItem(OVERVIEW_SEEN_KEY, "1");
    render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);

    await flushAnimationFrame();
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("dismiss hides the card and persists across mounts", async () => {
    const user = userEvent.setup();
    render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);

    await user.click(await screen.findByRole("button", { name: "Don't show this again" }));

    expect(screen.queryByRole("complementary")).toBeNull();
    expect(localStorage.getItem(DISMISSED_KEY)).toBe("1");

    cleanup();
    render(<OrientationCard slug="/sphere-1/goal-2/action-2-1" locale="en" />);
    await flushAnimationFrame();
    expect(screen.queryByRole("complementary")).toBeNull();
  });
});

describe("OrientationTracker", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("classifies a home-page entry as non-deep, so later deep pages show no card", async () => {
    setPath("/en");
    render(<OrientationTracker />);
    await waitFor(() => {
      expect(sessionStorage.getItem(ENTRY_KEY)).toBe("other");
    });
  });

  it("keeps the first classification when navigating to further pages", async () => {
    setPath("/en/sphere-1");
    render(<OrientationTracker />);
    await waitFor(() => {
      expect(sessionStorage.getItem(ENTRY_KEY)).toBe("deep");
    });

    setPath("/en");
    render(<OrientationTracker />);
    await waitFor(() => {
      expect(sessionStorage.getItem(ENTRY_KEY)).toBe("deep");
    });
  });

  it("records visiting an overview page (translated slug)", async () => {
    setPath("/introduccio");
    render(<OrientationTracker />);
    await waitFor(() => {
      expect(localStorage.getItem(OVERVIEW_SEEN_KEY)).toBe("1");
    });
  });
});
