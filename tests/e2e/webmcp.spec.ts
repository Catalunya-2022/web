import { expect, test } from "@playwright/test";
import { executeWebMcpTool, gotoStablePage, waitForWebMcpTools } from "./helpers";

const TOOL_NAMES = ["get_document_metadata", "get_section", "list_proposals", "search_document"];

type SearchResult = { results: Array<{ url: string; snippet: string }>; language: string };
type SectionResult = { url: string; markdown: string; slug: string };
type ProposalsResult = { count: number; proposals: Array<{ slug: string; url: string }> };
type MetadataResult = {
  title: string;
  doi: string;
  citation: string;
  downloads: { pdf: string; epub: string; markdown: string };
  spheres: Array<{ goals: unknown[] }>;
};

test("a document page registers the four read-only tools with valid schemas", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    const fromAnalytics = [message.text(), message.location().url].some((s) => s.includes("/reset/"));
    if (message.type() === "error" && !fromAnalytics) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await gotoStablePage(page, "/en/sphere-1/goal-1/action-1-1");
  const tools = await waitForWebMcpTools(page);

  expect(tools.map((tool) => tool.name).sort()).toEqual(TOOL_NAMES);
  for (const tool of tools) {
    expect(tool.readOnly).toBe(true);
    expect(tool.inputSchema.type).toBe("object");
    expect(tool.description.length).toBeGreaterThan(0);
  }
  const search = tools.find((tool) => tool.name === "search_document")!;
  expect(search.inputSchema.required).toEqual(["query"]);
  expect(search.inputSchema.properties?.scope?.enum).toEqual(["sphere", "goal", "action", "static"]);
  expect(search.description).toContain("this page's language");
  expect(errors).toEqual([]);
});

test("search_document answers a research question with English URLs", async ({ page }) => {
  await gotoStablePage(page, "/en/sphere-1/goal-1/action-1-1");
  await waitForWebMcpTools(page);

  const result = await executeWebMcpTool<SearchResult>(page, "search_document", { query: "housing" });
  expect(result.language).toBe("en");
  expect(result.results.length).toBeGreaterThan(0);
  expect(result.results.length).toBeLessThanOrEqual(8);
  for (const row of result.results) {
    expect(row.url).toMatch(/^https:\/\/2022\.cat\/en\//);
    expect(row.snippet.length).toBeGreaterThan(0);
  }
});

test("get_section reads the open Catalan goal page from its markdown mirror", async ({ page }) => {
  await gotoStablePage(page, "/ambit-1/objectiu-2");
  await waitForWebMcpTools(page);

  const result = await executeWebMcpTool<SectionResult>(page, "get_section");
  expect(result.slug).toBe("/sphere-1/goal-2");
  expect(result.url).toBe("https://2022.cat/ambit-1/objectiu-2");
  expect(result.markdown.startsWith("# OBJECTIU 2")).toBe(true);
  expect(result.markdown).toContain("https://2022.cat/ambit-1/objectiu-2");
  expect(result.markdown).toContain("## Accelerar la transformació del sistema educatiu");
});

test("list_proposals returns goal 9's five actions in order", async ({ page }) => {
  await gotoStablePage(page, "/en/sphere-3/goal-9");
  await waitForWebMcpTools(page);

  const result = await executeWebMcpTool<ProposalsResult>(page, "list_proposals", { goalId: 9 });
  expect(result.count).toBe(5);
  expect(result.proposals.map((row) => row.slug)).toEqual(
    [1, 2, 3, 4, 5].map((n) => `/sphere-3/goal-9/action-9-${n}`),
  );
});

test("get_document_metadata carries the Spanish record and downloads", async ({ page }) => {
  await gotoStablePage(page, "/es/introduccion");
  await waitForWebMcpTools(page);

  const result = await executeWebMcpTool<MetadataResult>(page, "get_document_metadata");
  expect(result.title).toBe("Catalunya 2022 - RESET: Llamamiento para reactivar el país");
  expect(result.doi).toBe("https://doi.org/10.5281/zenodo.19500831");
  expect(result.citation).toContain("Grup de Treball Catalunya 2022");
  expect(result.spheres).toHaveLength(3);
  expect(result.downloads).toEqual({
    pdf: "https://2022.cat/documents/catalunya-2022-es.pdf",
    epub: "https://2022.cat/documents/catalunya-2022-es.epub",
    markdown: "https://2022.cat/documents/catalunya-2022-es.md",
  });
});

test("switching the language re-registers the tools in Spanish", async ({ page }) => {
  await gotoStablePage(page, "/en/introduction");
  const english = await waitForWebMcpTools(page);
  expect(english.find((tool) => tool.name === "get_section")?.description).toContain("this page's language");

  await page.getByRole("button", { name: "English" }).click();
  await page.getByText("Español").click();
  await expect(page).toHaveURL(/\/es\/introduccion$/);

  const spanish = await waitForWebMcpTools(page);
  expect(spanish.map((tool) => tool.name).sort()).toEqual(TOOL_NAMES);
  expect(spanish.find((tool) => tool.name === "get_section")?.description).toContain("idioma de esta página");
});
