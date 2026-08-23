import { describe, it, expect } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import { OGTemplate, OG_SIZE } from "../og-template";

/** Collect every string rendered anywhere in the element tree. */
function collectText(node: ReactNode, out: string[] = []): string[] {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((child) => collectText(child, out));
  else if (isValidElement(node)) {
    collectText((node.props as { children?: ReactNode }).children, out);
  }
  return out;
}

describe("OGTemplate", () => {
  it("declares the standard OG canvas size", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });

  it("renders title, label and subtitle for a hierarchy page", () => {
    const el = OGTemplate({
      label: "Sphere 2 · Goal 6",
      title: "Feed the world",
      subtitle: "A goal about the agri-food chain",
      locale: "en",
    });
    const text = collectText(el as ReactElement).join(" | ");
    expect(text).toContain("Feed the world");
    // The template uppercases the label itself (Satori lacks text-transform).
    expect(text).toContain("SPHERE 2 · GOAL 6");
    expect(text).toContain("A goal about the agri-food chain");
    expect(text).toContain("Catalunya 2022");
  });

  it("truncates long subtitles with an ellipsis", () => {
    const el = OGTemplate({
      title: "T",
      subtitle: "x".repeat(200),
      locale: "ca",
    });
    const text = collectText(el as ReactElement).join("");
    expect(text).toContain("x".repeat(140) + "…");
    expect(text).not.toContain("x".repeat(141));
  });

  it("renders a photo element only when photoSrc is provided", () => {
    const withPhoto = JSON.stringify(
      OGTemplate({
        title: "Member",
        locale: "en",
        photoSrc: "data:image/png;base64,abc",
      })
    );
    const withoutPhoto = JSON.stringify(
      OGTemplate({ title: "Member", locale: "en" })
    );
    expect(withPhoto).toContain("data:image/png;base64,abc");
    expect(withoutPhoto).not.toContain("data:image");
  });
});
