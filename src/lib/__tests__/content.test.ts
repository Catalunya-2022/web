import { describe, it, expect } from "vitest";
import { loadContent } from "../content";
import type { Locale } from "@/i18n/routing";

// Integration tests against the real content/ tree — loadContent is the single
// entry point every MDX page renders through, so these lock its contract:
// H1 → identifier, H2 → subtitle, remainder → body, verbatim file → raw.

const LOCALES: Locale[] = ["ca", "en", "es"];

describe("loadContent", () => {
  it.each(LOCALES)("parses /introduction (%s) into the ParsedContent shape", async (locale) => {
    const content = await loadContent("/introduction", locale);

    expect(content.identifier.length).toBeGreaterThan(0);
    expect(content.subtitle.length).toBeGreaterThan(0);
    expect(content.body.length).toBeGreaterThan(0);
    // headings are extracted as text, not markdown
    expect(content.identifier).not.toMatch(/^#/);
    expect(content.subtitle).not.toMatch(/^#/);
    // body is the file remainder: no leading blank lines, present in raw
    expect(content.body).toBe(content.body.trim());
    expect(content.raw).toContain(content.body.slice(0, 80));
    expect(content.raw).toContain(`# ${content.identifier}`);
    expect(content.raw).toContain(`## ${content.subtitle}`);
  });

  it("resolves hierarchy slugs to sphere, goal, and action files", async () => {
    const sphere = await loadContent("/sphere-1", "en");
    const goal = await loadContent("/sphere-1/goal-2", "en");
    const action = await loadContent("/sphere-1/goal-2/action-2-1", "en");

    for (const content of [sphere, goal, action]) {
      expect(content.identifier.length).toBeGreaterThan(0);
      expect(content.body.length).toBeGreaterThan(0);
    }
    // each level is a distinct document
    expect(goal.raw).not.toBe(sphere.raw);
    expect(action.raw).not.toBe(goal.raw);
  });

  it("defaults to the Catalan locale", async () => {
    const implicit = await loadContent("/introduction");
    const explicit = await loadContent("/introduction", "ca");
    expect(implicit).toEqual(explicit);
  });

  it("returns locale-specific text for the same slug", async () => {
    const [ca, en, es] = await Promise.all(
      LOCALES.map((locale) => loadContent("/executive-summary", locale))
    );
    expect(ca.raw).not.toBe(en.raw);
    expect(es.raw).not.toBe(en.raw);
  });

  it("rejects unknown slugs", async () => {
    await expect(loadContent("/no-such-page", "ca")).rejects.toThrow(
      "Unknown content slug"
    );
  });

  it("rejects path-traversal attempts", async () => {
    await expect(loadContent("/introduction/../secret", "ca")).rejects.toThrow(
      "Unknown content slug"
    );
  });

  it("rejects rather than silently falling back for a bogus locale", async () => {
    await expect(
      loadContent("/introduction", "xx" as Locale)
    ).rejects.toThrow();
  });
});
