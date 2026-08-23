import { describe, it, expect } from "vitest";
import { extractHeadings } from "../content-utils";

describe("extractHeadings", () => {
  it("extracts h1 and h2 from valid content", () => {
    const result = extractHeadings("# Title\n## Subtitle\nBody text");
    expect(result.h1).toBe("Title");
    expect(result.h2).toBe("Subtitle");
    expect(result.bodyStartIndex).toBe(2);
  });

  it("finds headings after leading blank lines and keeps bodyStartIndex after the H2 line", () => {
    const result = extractHeadings("\n\n# Title\n\n## Subtitle\n\nBody text");

    expect(result).toEqual({
      h1: "Title",
      h2: "Subtitle",
      bodyStartIndex: 5,
    });
  });

  it("throws for empty content", () => {
    expect(() => extractHeadings("")).toThrow("missing a required H1");
  });

  it("throws for content without H1 heading", () => {
    expect(() => extractHeadings("## Only subtitle\nBody text")).toThrow(
      "missing a required H1"
    );
  });

  it("throws for content with only body text", () => {
    expect(() => extractHeadings("Just a paragraph")).toThrow(
      "missing a required H1"
    );
  });

  it("throws for content without H2 heading", () => {
    expect(() => extractHeadings("# Title\nBody text")).toThrow(
      "missing a required H2"
    );
  });

  it("throws when body content appears before the required H2 heading", () => {
    expect(() => extractHeadings("# Title\n\nBody text\n\n## Subtitle")).toThrow(
      "missing a required H2"
    );
  });
});
