import { describe, it, expect } from "vitest";
import {
  getContentLastModified,
  getTaskForceLastModified,
} from "../content-dates";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
// The site-wide floor. If this assertion fails after a BASE_LAST_MOD bump,
// update it; if it fails without one, dates have silently regressed.
const FLOOR = "2026-08-16";

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe("content dates", () => {
  it("returns valid ISO dates at or above the site-wide floor", () => {
    for (const value of [
      getContentLastModified("/introduction"),
      getContentLastModified("/sphere-1/goal-1/action-1-1"),
      getTaskForceLastModified(),
    ]) {
      expect(value).toMatch(ISO_DATE);
      expect(value >= FLOOR).toBe(true);
      expect(value <= tomorrow()).toBe(true);
    }
  });

  it("falls back to the floor for unknown slugs", () => {
    const unknown = getContentLastModified("/no-such-page");
    expect(unknown).toMatch(ISO_DATE);
    expect(unknown).toBe(getContentLastModified("/also-missing"));
  });
});
