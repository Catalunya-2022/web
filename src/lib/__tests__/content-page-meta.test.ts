import { describe, expect, it } from "vitest";
import { getContentPageMetadata } from "../content-page-meta";

describe("getContentPageMetadata", () => {
  it("keeps titled pages on their identifier and subtitle deck by default", () => {
    expect(
      getContentPageMetadata({
        identifier: "Executive summary",
        subtitle: "Three spheres, twelve goals, ninety-one actions",
        body: "First paragraph.",
      })
    ).toEqual({
      title: "Executive summary",
      description: "Three spheres, twelve goals, ninety-one actions",
    });
  });

  it("prefers the semantic subtitle for numbered content pages when requested", () => {
    expect(
      getContentPageMetadata({
        identifier: "GOAL 7",
        subtitle: "To strengthen knowledge building",
        body: "First paragraph.",
      }, {
        title: "subtitle-or-identifier",
      }).title
    ).toBe("To strengthen knowledge building");
  });

  it("builds a clean excerpt from the first paragraph when requested", () => {
    expect(
      getContentPageMetadata({
        identifier: "GOAL 7",
        subtitle: "To strengthen knowledge building",
        body:
          "This [paragraph](https://example.com) includes **markdown** and `inline code`.\n\nSecond paragraph.",
      }, {
        description: "first-paragraph",
      }).description
    ).toBe("This paragraph includes markdown and inline code.");
  });

  it("falls back to the identifier when no subtitle exists", () => {
    expect(
      getContentPageMetadata({
        identifier: "Introduction",
        subtitle: null,
        body: "",
      }).title
    ).toBe("Introduction");
  });
});
