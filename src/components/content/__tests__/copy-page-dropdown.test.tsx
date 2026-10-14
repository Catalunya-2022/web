// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyPageProvider } from "@/components/content/copy-page-context";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { CopyPageDropdown } from "@/components/content/copy-page-dropdown";
import { MobileBreadcrumbBar } from "@/components/layout/mobile-breadcrumb-bar";
import { buildCopyPagePayload, type CopyPagePayload } from "@/lib/copy-text-generators";
import { loadContent } from "@/lib/content";
import { uiStrings } from "@/lib/ui-strings";

const trackEvent = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackEvent: (name: string) => trackEvent(name) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/en/sphere-1/goal-1/action-1-1" }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => <button type="button">sidebar</button>,
}));
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, "aria-label": ariaLabel }: { children: ReactNode; "aria-label"?: string }) => (
    <button type="button" aria-label={ariaLabel}>{children}</button>
  ),
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onSelect,
    asChild,
  }: {
    children: ReactNode;
    onSelect?: () => void;
    asChild?: boolean;
  }) => (asChild ? <>{children}</> : <button type="button" onClick={() => onSelect?.()}>{children}</button>),
}));

const SLUG = "/sphere-1/goal-1/action-1-1";
const t = uiStrings.en;
const written: string[] = [];
let page: { title: string; slug: string; rawContent: string; locale: "en"; citable: boolean };
let expected: CopyPagePayload;

beforeAll(async () => {
  const content = await loadContent(SLUG, "en");
  page = { title: content.subtitle, slug: SLUG, rawContent: content.raw, locale: "en", citable: true };
  expected = buildCopyPagePayload(page);
});

beforeEach(() => {
  written.length = 0;
  trackEvent.mockClear();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn(async (text: string) => { written.push(text); }) },
    configurable: true,
  });
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Harness({ withSetter = true }: { withSetter?: boolean }) {
  return (
    <CopyPageProvider>
      {withSetter && <CopyPageSetter {...page} />}
      <div data-testid="desktop"><CopyPageDropdown locale="en" citable /></div>
      <div data-testid="mobile"><MobileBreadcrumbBar locale="en" /></div>
    </CopyPageProvider>
  );
}

async function flush() {
  await act(async () => { await vi.advanceTimersByTimeAsync(0); });
}

function advance(ms: number) {
  act(() => { vi.advanceTimersByTime(ms); });
}

async function mount(withSetter = true) {
  render(<Harness withSetter={withSetter} />);
  await flush();
  const desktop = screen.getByTestId("desktop");
  const mobile = screen.getByTestId("mobile");
  return {
    desktop,
    mobile,
    desktopMain: desktop.querySelector("button") as HTMLButtonElement,
    mobileMain: mobile.querySelectorAll("button")[1] as HTMLButtonElement | undefined,
    item: (root: HTMLElement, text: string) =>
      Array.from(root.querySelectorAll("button")).find((b) => b.textContent?.includes(text)) as HTMLButtonElement,
  };
}

describe("CopyPageDropdown", () => {
  it("copies the page markdown read from the copy-page context", async () => {
    const { desktop, desktopMain } = await mount();
    const status = within(desktop).getByRole("status");

    expect(desktopMain).toHaveTextContent(t.copyPage);
    expect(status).toHaveTextContent("");

    fireEvent.click(desktopMain);
    expect(desktopMain).toHaveTextContent(t.copying);
    await flush();
    expect(written).toEqual([expected.markdownText]);
    expect(desktopMain).toHaveTextContent(t.pageCopied);
    expect(status).toHaveTextContent(t.pageCopied);
    expect(trackEvent.mock.calls).toEqual([["Copy Page: Markdown"]]);

    advance(1999);
    expect(desktopMain).toHaveTextContent(t.pageCopied);
    advance(1);
    expect(desktopMain).toHaveTextContent(t.copyPage);
    expect(status).toHaveTextContent("");
  });

  it("copies the citation and the link through the same feedback path", async () => {
    const { desktop, desktopMain, item } = await mount();
    const status = within(desktop).getByRole("status");

    fireEvent.click(item(desktop, "Copy citation"));
    await flush();
    expect(written).toEqual([expected.citationText]);
    expect(desktopMain).toHaveTextContent(t.citationCopied);
    expect(status).toHaveTextContent(t.citationCopied);
    advance(2000);
    expect(desktopMain).toHaveTextContent(t.copyPage);

    fireEvent.click(item(desktop, t.copyLink));
    await flush();
    expect(written).toEqual([expected.citationText, expected.url]);
    expect(desktopMain).toHaveTextContent(t.linkCopied);
    expect(status).toHaveTextContent(t.linkCopied);
    advance(2000);
    expect(desktopMain).toHaveTextContent(t.copyPage);
    expect(trackEvent.mock.calls).toEqual([["Copy Page: Citation"], ["Copy Page: Share Link"]]);
  });

  it("links to ChatGPT and Claude with the generator hrefs on desktop and mobile", async () => {
    const { desktop, mobile } = await mount();
    for (const root of [desktop, mobile]) {
      const hrefs = Array.from(root.querySelectorAll("a[target=_blank]")).map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual([expected.chatgptHref, expected.claudeHref]);
    }
    expect(expected.chatgptHref).toContain(encodeURIComponent(expected.url));
  });

  it("writes the same markdown from the mobile button and announces the result", async () => {
    const { mobile, mobileMain } = await mount();
    const status = within(mobile).getByRole("status");
    expect(mobileMain).toHaveAttribute("aria-label", t.copyPage);

    fireEvent.click(mobileMain!);
    expect(mobileMain).toHaveAttribute("aria-label", t.copyPage);
    await flush();
    expect(written).toEqual([expected.markdownText]);
    expect(mobileMain).toHaveAttribute("aria-label", t.pageCopied);
    expect(status).toHaveTextContent(t.pageCopied);
    advance(2000);
    expect(mobileMain).toHaveAttribute("aria-label", t.copyPage);
    expect(status).toHaveTextContent("");
  });

  it("renders the idle control and ignores clicks until the page data is announced", async () => {
    const { desktop, desktopMain, mobileMain } = await mount(false);
    expect(desktopMain).toHaveTextContent(t.copyPage);
    expect(desktop.querySelector("a[target=_blank]")).toBeNull();
    expect(mobileMain).toBeUndefined();

    fireEvent.click(desktopMain);
    await flush();
    expect(written).toEqual([]);
    expect(trackEvent).not.toHaveBeenCalled();
    expect(desktopMain).toHaveTextContent(t.copyPage);
  });

  it("does nothing on every copy path without a secure-context clipboard", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const { desktop, desktopMain, item } = await mount();

    fireEvent.click(desktopMain);
    fireEvent.click(item(desktop, "Copy citation"));
    fireEvent.click(item(desktop, t.copyLink));
    await flush();
    expect(trackEvent).not.toHaveBeenCalled();
    expect(desktopMain).toHaveTextContent(t.copyPage);
    expect(within(desktop).getByRole("status")).toHaveTextContent("");
  });
});
