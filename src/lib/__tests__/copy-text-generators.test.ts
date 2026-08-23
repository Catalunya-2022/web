import { describe, expect, it } from "vitest";
import { buildCopyPagePayload, generateMcpPageText } from "../copy-text-generators";
import { LLM_URL_QUERY_BUDGET } from "../url-utils";
import {
  mcpClientConfigs,
  mcpExampleQuestions,
  mcpIntroText,
  mcpPrompts,
  mcpResources,
  mcpServerDescription,
  mcpTechnicalDetails,
  mcpTools,
} from "../data/mcp";

describe("buildCopyPagePayload", () => {
  const base = {
    title: "Acció 2.1",
    slug: "/sphere-1/goal-2/action-2-1",
    rawContent: "# Acció 2.1\n\nContingut de prova.",
    locale: "ca" as const,
  };

  it("builds the markdown payload around the localized URL", () => {
    const payload = buildCopyPagePayload({ ...base, citable: false });
    expect(payload.url).toBe("https://2022.cat/ambit-1/objectiu-2/accio-2-1");
    expect(payload.markdownText).toContain("Acció 2.1");
    expect(payload.markdownText).toContain(payload.url);
    expect(payload.markdownText).not.toContain(payload.citationText);
  });

  it("appends the citation trailer only when citable", () => {
    const payload = buildCopyPagePayload({ ...base, citable: true });
    expect(payload.markdownText).toContain("Com citar");
    expect(payload.markdownText).toContain("10.5281/zenodo.19500831");
  });

  it("keeps the LLM hrefs within the encoded query budget", () => {
    const payload = buildCopyPagePayload({
      ...base,
      citable: false,
      rawContent: "à".repeat(20_000),
    });
    expect(payload.chatgptHref.startsWith("https://chatgpt.com/")).toBe(true);
    expect(payload.claudeHref.startsWith("https://claude.ai/new")).toBe(true);
    for (const href of [payload.chatgptHref, payload.claudeHref]) {
      const q = new URL(href).searchParams.get("q") ?? "";
      expect(q).toContain("Acció 2.1");
      expect(encodeURIComponent(q).length).toBeLessThanOrEqual(LLM_URL_QUERY_BUDGET);
    }
  });
});

describe("generateMcpPageText", () => {
  it("includes the MCP onboarding sections in exported markdown", () => {
    const text = generateMcpPageText(
      {
        intro: mcpIntroText.en,
        serverDescription: mcpServerDescription.en,
        tools: mcpTools,
        resources: mcpResources,
        prompts: mcpPrompts,
        clients: mcpClientConfigs,
        exampleQuestions: mcpExampleQuestions.en,
        technical: mcpTechnicalDetails,
      },
      "en",
    );

    expect(text).toContain("## What is MCP?");
    expect(text).toContain(mcpIntroText.en);
    expect(text).toContain("## How to Connect");
    expect(text).toContain("### ChatGPT");
    expect(text).toContain("```text");
    expect(text).toContain("## What Can You Ask?");
    expect(text).toContain("- What are the 3 spheres and how many goals does each one have?");
  });
});

describe("mcp copy data", () => {
  it("keeps locale and slug separate in the resource template example", () => {
    expect(mcpResources[1].description.en).toContain("sphere-1/goal-2");
    expect(mcpResources[1].description.en).not.toContain("en/sphere-1/goal-2");
  });

  it("uses current ChatGPT and Windsurf wording", () => {
    const chatgpt = mcpClientConfigs.find((config) => config.id === "chatgpt");
    const windsurf = mcpClientConfigs.find((config) => config.id === "windsurf");

    expect(chatgpt?.instructions.en).toContain("Settings → Apps");
    expect(chatgpt?.instructions.en).not.toContain("Add custom connector");
    expect(chatgpt?.note?.en).toContain("depends on your ChatGPT plan");

    expect(windsurf?.instructions.en).toContain(
      "Settings → Tools → Windsurf Settings",
    );
    expect(windsurf?.note?.en).toContain("\"serverUrl\" or \"url\"");
  });

  it("configures Cline and Continue with their remote streamable-http transports", () => {
    const cline = mcpClientConfigs.find((config) => config.id === "cline");
    const cont = mcpClientConfigs.find((config) => config.id === "continue");

    expect(cline?.code).toContain("\"type\": \"streamableHttp\"");
    expect(cline?.code).toContain("https://mcp.2022.cat");
    expect(cline?.note?.en).toContain("legacy SSE");

    expect(cont?.language).toBe("yaml");
    expect(cont?.code).toContain("type: streamable-http");
    expect(cont?.code).toContain("url: https://mcp.2022.cat");
    expect(cont?.note?.en).toContain("agent mode");
  });
});
