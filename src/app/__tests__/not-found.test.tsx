import { describe, expect, it, vi } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";

vi.mock("@/lib/route-locale", () => ({
  getCurrentLocale: async () => "en",
}));

// next/font/google only works inside the Next compiler.
vi.mock("@/lib/fonts", () => ({
  inter: { variable: "--font-inter" },
  outfit: { variable: "--font-outfit" },
}));

import NotFound, { metadata } from "../not-found";
import LocaleNotFound from "../[locale]/not-found";
import { NotFoundContent } from "@/components/content/not-found-content";
import { uiStrings } from "@/lib/ui-strings";

/** Walk the element tree without invoking any component. */
function walk(node: ReactNode, visit: (element: ReactElement) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
  } else if (isValidElement(node)) {
    visit(node);
    walk((node.props as { children?: ReactNode }).children, visit);
  }
}

function findElement(node: ReactNode, type: unknown): ReactElement | undefined {
  let found: ReactElement | undefined;
  walk(node, (element) => {
    if (!found && element.type === type) found = element;
  });
  return found;
}

describe("root 404 document", () => {
  it("titles the page from the generic Catalan heading and leaves robots to the not-found noindex", () => {
    expect(metadata.title).toBe(uiStrings.ca.notFoundHeading);
    expect(metadata.title).toBe("404: Pàgina no trobada");
    expect(metadata.robots).toBeNull();
  });

  it("owns a Catalan html element with the site fonts and renders the shared content in Catalan", () => {
    const tree = NotFound();
    const html = findElement(tree, "html");
    const body = findElement(tree, "body");
    const content = findElement(tree, NotFoundContent);

    expect(html?.props).toMatchObject({ lang: "ca", suppressHydrationWarning: true });
    expect((body?.props as { className: string }).className).toMatch(/font-sans/);
    expect(content?.props).toEqual({ initialLocale: "ca" });
  });
});

describe("locale 404 boundary", () => {
  it("renders the shared content with the request locale", async () => {
    const content = findElement(await LocaleNotFound(), NotFoundContent);

    expect(content?.props).toEqual({ initialLocale: "en" });
  });
});
