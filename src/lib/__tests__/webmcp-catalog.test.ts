import { describe, expect, it } from "vitest";
import { routing, type Locale, type Trilingual } from "@/i18n/routing";
import {
  mcpSectionHeadings,
  mcpSectionLabels,
  mcpTools,
  webmcpAvailability,
  webmcpAvailabilityLead,
  webmcpClosingText,
  webmcpIntroText,
  webmcpLearnMore,
  webmcpMessages,
  webmcpTools,
} from "@/lib/data/mcp";

const LOCALES = routing.locales as readonly Locale[];
const TOOL_NAME = /^[A-Za-z0-9_.-]{1,30}$/;

function eachLocale(field: Trilingual<string>, check: (value: string, locale: Locale) => void) {
  for (const locale of LOCALES) check(field[locale], locale);
}

describe("webmcpTools catalog", () => {
  it("mirrors the MCP server's four tool names", () => {
    const serverNames = mcpTools.map((tool) => tool.name).sort();
    expect(webmcpTools.map((tool) => tool.name).sort()).toEqual(serverNames);
    for (const tool of webmcpTools) expect(tool.name).toMatch(TOOL_NAME);
  });

  it("keeps every tool within the description budgets in all three languages", () => {
    for (const tool of webmcpTools) {
      eachLocale(tool.title, (value) => expect(value.length).toBeLessThanOrEqual(60));
      eachLocale(tool.description, (value) => expect(value.length).toBeLessThanOrEqual(500));
      for (const param of tool.params) {
        expect(param.name).toMatch(TOOL_NAME);
        eachLocale(param.description, (value) => expect(value.length).toBeLessThanOrEqual(150));
      }
    }
  });

  it("ships non-empty text without em dashes in every language", () => {
    const fields: Trilingual<string>[] = [
      webmcpIntroText,
      webmcpClosingText,
      webmcpLearnMore,
      webmcpAvailabilityLead,
      mcpSectionLabels.browser,
      mcpSectionHeadings.browser,
      ...webmcpAvailability,
      ...Object.values(webmcpMessages),
    ];
    for (const tool of webmcpTools) {
      fields.push(tool.title, tool.description, ...tool.params.map((param) => param.description));
    }
    for (const field of fields) {
      eachLocale(field, (value) => {
        expect(value.trim().length).toBeGreaterThan(0);
        expect(value).not.toContain("—");
      });
    }
  });

  it("declares the server's parameter contract minus locale", () => {
    const byName = Object.fromEntries(webmcpTools.map((tool) => [tool.name, tool]));

    const search = byName.search_document;
    expect(search.params.map((param) => param.name)).toEqual(["query", "scope"]);
    expect(search.params[0]).toMatchObject({ type: "string", required: true });
    expect(search.params[1]).toMatchObject({
      type: "string",
      enum: ["sphere", "goal", "action", "static"],
    });

    const section = byName.get_section;
    expect(section.params).toHaveLength(1);
    expect(section.params[0]).toMatchObject({ name: "slug", type: "string" });
    expect(section.params[0].required).toBeFalsy();

    const proposals = byName.list_proposals;
    expect(proposals.params.map((param) => param.name)).toEqual(["sphereId", "goalId"]);
    expect(proposals.params[0]).toMatchObject({ type: "integer", minimum: 1, maximum: 3 });
    expect(proposals.params[1]).toMatchObject({ type: "integer", minimum: 1, maximum: 12 });

    expect(byName.get_document_metadata.params).toEqual([]);
    for (const tool of webmcpTools) {
      expect(tool.params.some((param) => param.name === "locale")).toBe(false);
    }
  });

  it("uses the same placeholders in every language of each message", () => {
    for (const message of Object.values(webmcpMessages)) {
      const placeholders = LOCALES.map((locale) =>
        [...message[locale].matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort().join(",")
      );
      expect(new Set(placeholders).size).toBe(1);
    }
  });
});
