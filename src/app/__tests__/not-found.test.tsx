import { describe, expect, it, vi } from "vitest";
import { isValidElement, type ReactNode } from "react";

vi.mock("@/lib/route-locale", () => ({
  getCurrentLocale: async () => "en",
}));

import NotFound from "../not-found";
import LocaleNotFound from "../[locale]/not-found";

/** Collect every href in the element tree without invoking any component. */
function collectHrefs(node: ReactNode, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((child) => collectHrefs(child, out));
  } else if (isValidElement(node)) {
    const props = node.props as { href?: unknown; children?: ReactNode };
    if (typeof props.href === "string") {
      out.push(props.href);
    }
    collectHrefs(props.children, out);
  }
  return out;
}

describe("404 recovery links", () => {
  it("root 404 points lost visitors and agents at home, action plan, sitemap and llms.txt", () => {
    const hrefs = collectHrefs(NotFound());

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/pla-accio");
    expect(hrefs).toContain("/sitemap.xml");
    expect(hrefs).toContain("/llms.txt");
  });

  it("locale 404 offers the same recovery links, localized", async () => {
    const hrefs = collectHrefs(await LocaleNotFound());

    expect(hrefs).toContain("/en");
    expect(hrefs).toContain("/en/action-plan");
    expect(hrefs).toContain("/sitemap.xml");
    expect(hrefs).toContain("/en/llms.txt");
  });
});
