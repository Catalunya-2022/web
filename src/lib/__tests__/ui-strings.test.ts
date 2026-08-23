import { describe, expect, it } from "vitest";
import { formatUiString, uiStrings } from "../ui-strings";

describe("formatUiString", () => {
  it("replaces repeated placeholders with stringified values", () => {
    expect(
      formatUiString(uiStrings.en.showingOf, { count: 12, total: 230 })
    ).toBe("Showing 12 of 230 organizations");
  });

  it("leaves unknown placeholders intact", () => {
    expect(formatUiString("Value: {known} {missing}", { known: "ok" })).toBe(
      "Value: ok {missing}"
    );
  });

  it("substitutes literal query text that contains regex-like characters", () => {
    expect(
      formatUiString(uiStrings.en.noResultsPeople, {
        query: "a+b(c)?[d]{e}|^$",
      })
    ).toBe("No results found for “a+b(c)?[d]{e}|^$”.");
  });
});
