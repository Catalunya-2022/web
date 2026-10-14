import { describe, expect, it } from "vitest";
import { DOCUMENT_TITLE } from "../citation";
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

describe("document title family", () => {
  it.each(["ca", "en", "es"] as const)("keeps the %s action plan title and tagline aligned with the citation title", (locale) => {
    const t = uiStrings[locale];
    expect(t.actionPlanTitle).toBe(`RESET: ${t.ogTagline}`);
    expect(DOCUMENT_TITLE[locale]).toBe(`Catalunya 2022 - ${t.actionPlanTitle}`);
  });
});
