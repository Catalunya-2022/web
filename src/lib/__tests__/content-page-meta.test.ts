import { describe, expect, it } from "vitest";
import { getContentPageMetadata } from "../content-page-meta";

describe("getContentPageMetadata", () => {
  it("combines identifier and subtitle into the title", () => {
    expect(
      getContentPageMetadata({
        identifier: "Executive summary",
        subtitle: "Three spheres, twelve goals, ninety-one actions",
        body: "First paragraph.",
      })
    ).toEqual({
      title: "Executive summary: Three spheres, twelve goals, ninety-one actions",
      description: "First paragraph.",
    });
  });

  it("title-cases ALL-CAPS identifiers and builds a clean first-paragraph excerpt", () => {
    const meta = getContentPageMetadata({
      identifier: "GOAL 7",
      subtitle: "To strengthen knowledge building",
      body: "This [paragraph](https://example.com) includes **markdown** and `inline code`.\n\nSecond paragraph.",
    });
    expect(meta.title).toBe("Goal 7: To strengthen knowledge building");
    expect(meta.description).toBe("This paragraph includes markdown and inline code.");
  });

  it("falls back to the identifier when no subtitle exists", () => {
    expect(
      getContentPageMetadata({
        identifier: "Introduction",
        subtitle: null,
        body: "",
      })
    ).toEqual({ title: "Introduction", description: undefined });
  });
});
