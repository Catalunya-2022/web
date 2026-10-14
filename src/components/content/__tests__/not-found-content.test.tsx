// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { describeNotFoundPath, NotFoundContent } from "../not-found-content";
import { uiStrings } from "@/lib/ui-strings";

function visit(pathname: string): void {
  window.history.replaceState({}, "", pathname);
}

afterEach(() => {
  cleanup();
  visit("/");
  document.documentElement.lang = "";
  document.title = "";
});

describe("describeNotFoundPath", () => {
  it.each([
    ["/", "ca", false],
    ["/no-such-page", "ca", false],
    ["/ambit-9", "ca", true],
    ["/objectiu-7/accio-7-9", "ca", true],
    ["/en", "en", false],
    ["/en/no-such-page", "en", false],
    ["/en/sphere-1/goal-1/action-1-99", "en", true],
    ["/es/ambito-9", "es", true],
    ["/es/objetivo-2", "es", true],
    ["/en/action-plans", "en", false],
    ["/english", "ca", false],
    ["/es", "es", false],
  ] as const)("%s", (pathname, locale, hierarchy) => {
    expect(describeNotFoundPath(pathname)).toEqual({ locale, hierarchy });
  });
});

describe("NotFoundContent", () => {
  it("renders the English hierarchy copy, links, lang and title for a bad English action URL", () => {
    visit("/en/sphere-1/goal-1/action-1-99");
    render(<NotFoundContent initialLocale="ca" />);

    const t = uiStrings.en;
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(t.notFoundHeading);
    expect(screen.getByText(t.notFoundBodyHierarchy)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: t.notFoundSearch })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.goHome })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: t.exploreActionPlan })).toHaveAttribute("href", "/en/action-plan");
    expect(screen.getByRole("link", { name: t.siteMap })).toHaveAttribute("href", "/sitemap.xml");
    expect(screen.getByRole("link", { name: "llms.txt" })).toHaveAttribute("href", "/en/llms.txt");
    expect(screen.getByRole("link", { name: "Catalunya 2022" })).toHaveAttribute("href", "/en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe(t.notFoundHeading);
  });

  it("renders the Spanish generic copy for a bad Spanish URL outside the hierarchy", () => {
    visit("/es/no-such-page");
    render(<NotFoundContent initialLocale="ca" />);

    const t = uiStrings.es;
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(t.notFoundHeading);
    expect(screen.getByText(t.notFoundBody)).toBeInTheDocument();
    expect(screen.queryByText(t.notFoundBodyHierarchy)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.exploreActionPlan })).toHaveAttribute("href", "/es/plan-de-accion");
    expect(screen.getByRole("link", { name: "llms.txt" })).toHaveAttribute("href", "/es/llms.txt");
    expect(document.documentElement.lang).toBe("es");
  });

  it("stays Catalan for a pathless URL and uses the hierarchy sentence for a bad sphere", () => {
    visit("/ambit-9");
    render(<NotFoundContent initialLocale="ca" />);

    const t = uiStrings.ca;
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(t.notFoundHeading);
    expect(screen.getByText(t.notFoundBodyHierarchy)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: t.goHome })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: t.exploreActionPlan })).toHaveAttribute("href", "/pla-accio");
    expect(screen.getByRole("link", { name: "llms.txt" })).toHaveAttribute("href", "/llms.txt");
    expect(document.documentElement.lang).toBe("ca");
  });

  it("restores the localized title when the route metadata rewrites it after hydration", async () => {
    visit("/en/no-such-page");
    render(<NotFoundContent initialLocale="ca" />);
    expect(document.title).toBe(uiStrings.en.notFoundHeading);

    document.title = uiStrings.ca.notFoundHeading;

    await waitFor(() => expect(document.title).toBe(uiStrings.en.notFoundHeading));
  });

  it("exposes exactly one main landmark", () => {
    visit("/no-such-page");
    render(<NotFoundContent initialLocale="ca" />);

    expect(screen.getAllByRole("main")).toHaveLength(1);
  });
});
