import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { Locale } from "@/i18n/routing";
import type { SearchDocument } from "@/lib/search-engine";
import { generateCorpus } from "@/lib/search-corpus";
import { ACTION_COUNTS } from "@/lib/data/constants";
import { DOCUMENT_TITLE } from "@/lib/citation";
import { webmcpTools } from "@/lib/data/mcp";
import type {
  WebMcpDeps,
  WebMcpError,
  WebMcpMetadataResult,
  WebMcpPageData,
  WebMcpProposalsResult,
  WebMcpSearchResult,
  WebMcpSectionResult,
} from "@/lib/webmcp-tools";

const corpora: Record<Locale, SearchDocument[]> = { ca: [], en: [], es: [] };

beforeAll(() => {
  for (const locale of ["ca", "en", "es"] as const) corpora[locale] = generateCorpus(locale);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.resetModules();
});

type Overrides = Partial<Omit<WebMcpDeps, "locale" | "onSuccess">> & { pageData?: WebMcpPageData };

async function setup(locale: Locale, overrides: Overrides = {}) {
  vi.resetModules();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const match = String(input).match(/search-corpus-(ca|en|es)\.json/);
      if (!match) throw new Error(`unexpected fetch ${String(input)}`);
      return { ok: true, json: async () => corpora[match[1] as Locale] };
    })
  );
  const engine = await import("@/lib/search-engine");
  const { createWebMcpTools } = await import("@/lib/webmcp-tools");
  const fetchText = vi.fn(async (url: string) => `# SECTION\n\n## Title of ${url}\n\nBody text.`);
  const onSuccess = vi.fn();
  const tools = createWebMcpTools({
    locale,
    getPageData: () => overrides.pageData ?? null,
    search: overrides.search ?? engine.search,
    ensureIndex: overrides.ensureIndex ?? engine.ensureIndex,
    getCorpusDocuments: overrides.getCorpusDocuments ?? engine.getCorpusDocuments,
    fetchText: overrides.fetchText ?? fetchText,
    onSuccess,
  });
  const byName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
  const call = (name: string, input: Record<string, unknown> = {}) =>
    byName[name].execute(input, { signal: new AbortController().signal });
  return { tools, byName, call, fetchText, onSuccess, engine };
}

describe("createWebMcpTools", () => {
  it("returns the four read-only tools with localized titles and descriptions", async () => {
    const { tools, byName } = await setup("es");
    expect(tools.map((tool) => tool.name).sort()).toEqual(
      webmcpTools.map((tool) => tool.name).sort()
    );
    for (const tool of tools) expect(tool.annotations?.readOnlyHint).toBe(true);
    expect(byName.search_document.title).toBe("Buscar en el documento");
    expect(byName.get_section.description).toContain("idioma de esta página");
  });

  it("builds a JSON Schema per tool from the catalog in the page language", async () => {
    const { byName } = await setup("en");
    const search = byName.search_document.inputSchema as {
      type: string;
      required: string[];
      additionalProperties: boolean;
      properties: Record<string, { type: string; description: string; enum?: string[] }>;
    };
    expect(search.type).toBe("object");
    expect(search.required).toEqual(["query"]);
    expect(search.additionalProperties).toBe(false);
    expect(search.properties.query.description).toContain("100 characters");
    expect(search.properties.scope.enum).toEqual(["sphere", "goal", "action", "static"]);

    const proposals = byName.list_proposals.inputSchema as {
      required?: string[];
      properties: Record<string, { type: string; minimum: number; maximum: number }>;
    };
    expect(proposals.required ?? []).toEqual([]);
    expect(proposals.properties.goalId).toMatchObject({ type: "integer", minimum: 1, maximum: 12 });

    const metadata = byName.get_document_metadata.inputSchema as { properties: object };
    expect(metadata.properties).toEqual({});
  });
});

describe("search_document", () => {
  it("returns at most 8 localized results for a topic (AE1)", async () => {
    const { call, onSuccess } = await setup("en");
    const result = (await call("search_document", { query: "housing" })) as WebMcpSearchResult;
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.length).toBeLessThanOrEqual(8);
    for (const row of result.results) {
      expect(row.identifier.length).toBeGreaterThan(0);
      expect(row.breadcrumb.length).toBeGreaterThan(0);
      expect(row.url).toMatch(/^https:\/\/2022\.cat\/en\//);
      expect(row.snippet.length).toBeGreaterThan(0);
    }
    expect(result.language).toBe("en");
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("search_document");
  });

  it("returns a message that names list_proposals for an empty or unmatched query (AE2)", async () => {
    for (const locale of ["ca", "en", "es"] as const) {
      const { call, onSuccess } = await setup(locale);
      const empty = (await call("search_document", { query: "   " })) as WebMcpError;
      expect(empty.error).toContain("list_proposals");
      const none = (await call("search_document", { query: "zzqxjvwk" })) as WebMcpError;
      expect(none.error).toContain("list_proposals");
      expect(none.error).toContain("zzqxjvwk");
      expect(onSuccess).not.toHaveBeenCalled();
    }
  });

  it("maps scope static to the three document pages and scope action to actions", async () => {
    const { call } = await setup("en");
    const statics = (await call("search_document", {
      query: "Catalonia",
      scope: "static",
    })) as WebMcpSearchResult;
    expect(statics.results.length).toBeGreaterThan(0);
    for (const row of statics.results) {
      expect(["/introduction", "/executive-summary", "/train-of-prosperity"]).toContain(row.slug);
    }
    const actions = (await call("search_document", {
      query: "energy",
      scope: "action",
    })) as WebMcpSearchResult;
    expect(actions.results.length).toBeGreaterThan(0);
    for (const row of actions.results) expect(row.slug).toMatch(/^\/sphere-\d\/goal-\d+\/action-/);
  });

  it("keeps unscoped results within the document sections", async () => {
    expect(corpora.en.some((doc) => doc.slug === "/task-force/victoria-alsina")).toBe(true);
    const { call } = await setup("en");
    for (const query of ["Alsina", "MCP"]) {
      const result = (await call("search_document", { query })) as WebMcpSearchResult | WebMcpError;
      if ("error" in result) {
        expect(result.error).toContain(query);
        continue;
      }
      for (const row of result.results) {
        expect(row.slug).not.toBe("/");
        expect(row.slug).not.toMatch(/^\/(task-force|mcp|press|organizations)/);
      }
    }
  });

  it("rejects unknown scopes and names the valid values", async () => {
    const { call, onSuccess } = await setup("en");
    for (const scope of ["constructor", "member", "actions"]) {
      const result = (await call("search_document", { query: "housing", scope })) as WebMcpError;
      expect(result.error).toContain(scope);
      expect(result.error).toContain("sphere, goal, action, static");
    }
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("reports the match count before the cap as total", async () => {
    const { call } = await setup("en");
    const result = (await call("search_document", { query: "Catalonia" })) as WebMcpSearchResult;
    expect(result.results.length).toBe(8);
    expect(result.total).toBeGreaterThan(8);
  });

  it("caps the query at 100 characters and reports search failures as error objects", async () => {
    const search = vi.fn(async () => []);
    const capped = await setup("en", { search });
    await capped.call("search_document", { query: "a".repeat(150) });
    expect((search.mock.calls[0] as unknown[])[0]).toHaveLength(100);

    const failing = await setup("en", {
      search: vi.fn(async () => {
        throw new Error("index unavailable");
      }),
    });
    const result = (await failing.call("search_document", { query: "housing" })) as WebMcpError;
    expect(result.error).toContain("index");
  });
});

describe("get_section", () => {
  it("reads the current page and any document page from the localized mirror (AE3)", async () => {
    const { call, fetchText } = await setup("ca", {
      pageData: { slug: "/sphere-1/goal-2", title: "Objectiu 2", rawContent: "raw" },
    });
    const current = (await call("get_section", {})) as WebMcpSectionResult;
    expect(fetchText).toHaveBeenLastCalledWith("/ambit-1/objectiu-2.md");
    expect(current.url).toBe("https://2022.cat/ambit-1/objectiu-2");
    expect(current.markdown).toContain("Body text.");
    expect(current.title).toBe("Title of /ambit-1/objectiu-2.md");

    const other = (await call("get_section", {
      slug: "sphere-2/goal-6/action-6-1",
    })) as WebMcpSectionResult;
    expect(fetchText).toHaveBeenLastCalledWith("/ambit-2/objectiu-6/accio-6-1.md");
    expect(other.url).toBe("https://2022.cat/ambit-2/objectiu-6/accio-6-1");
    expect(other.slug).toBe("/sphere-2/goal-6/action-6-1");
  });

  it("accepts canonical slugs, localized paths, site URLs and .md suffixes", async () => {
    const { normalizeSectionSlug } = await import("@/lib/webmcp-tools");
    const forms = [
      "/en/sphere-1/goal-1/action-1-1",
      "https://2022.cat/es/ambito-1/objetivo-1/accion-1-1",
      "sphere-1/goal-1/action-1-1.md",
      "accio-1-1".length ? "/ambit-1/objectiu-1/accio-1-1" : "",
    ];
    for (const form of forms) expect(normalizeSectionSlug(form)).toBe("/sphere-1/goal-1/action-1-1");
    expect(normalizeSectionSlug("introduction")).toBe("/introduction");
    expect(normalizeSectionSlug("/introduccio")).toBe("/introduction");
    expect(normalizeSectionSlug("https://2022.cat/en/executive-summary.md")).toBe("/executive-summary");
    expect(normalizeSectionSlug("sphere-9/goal-1")).toBeNull();
    expect(normalizeSectionSlug("sphere-1/goal-1/action-1-99")).toBeNull();
    expect(normalizeSectionSlug("task-force/victoria-alsina")).toBeNull();
    expect(normalizeSectionSlug("https://example.com/en/introduction")).toBeNull();
  });

  it("rebuilds non-canonical document slugs so fetches land on real mirrors", async () => {
    const en = await setup("en");
    const rebuilt = (await en.call("get_section", { slug: "sphere-0x1/goal-1" })) as WebMcpSectionResult;
    expect(en.fetchText).toHaveBeenLastCalledWith("/en/sphere-1/goal-1.md");
    expect(rebuilt.slug).toBe("/sphere-1/goal-1");

    const ca = await setup("ca");
    await ca.call("get_section", { slug: "ambito-1" });
    expect(ca.fetchText).toHaveBeenLastCalledWith("/ambit-1.md");

    const es = await setup("es");
    await es.call("get_section", { slug: "/es/ambit-1/objectiu-2" });
    expect(es.fetchText).toHaveBeenLastCalledWith("/es/ambito-1/objetivo-2.md");
  });

  it("refuses non-document pages with their URL and never fetches outside the document set (AE4)", async () => {
    const { call, fetchText } = await setup("en");
    const member = (await call("get_section", { slug: "task-force/victoria-alsina" })) as WebMcpError;
    expect(member.error).toContain("https://2022.cat/en/task-force/victoria-alsina");
    expect(member.hint).toBe("search_document");
    const orgs = (await call("get_section", { slug: "/en/organizations" })) as WebMcpError;
    expect(orgs.error).toContain("https://2022.cat/en/organizations");
    expect(orgs.hint).toBe("search_document");
    for (const slug of ["search-corpus-en.json", ".well-known/security.txt", "../documents/catalunya-2022-en.md"]) {
      const result = (await call("get_section", { slug })) as WebMcpError;
      expect(result.error.length).toBeGreaterThan(0);
    }
    expect(fetchText).not.toHaveBeenCalled();
  });

  it("serves the in-memory text of a non-document current page and guides when there is none", async () => {
    const withPage = await setup("en", {
      pageData: { slug: "/organizations", title: "Organizations", rawContent: "# Organizations\n\nList" },
    });
    const page = (await withPage.call("get_section", {})) as WebMcpSectionResult;
    expect(page.markdown).toContain("List");
    expect(page.url).toBe("https://2022.cat/en/organizations");
    expect(withPage.fetchText).not.toHaveBeenCalled();

    const noPage = await setup("en");
    const result = (await noPage.call("get_section", {})) as WebMcpError;
    expect(result.error).toContain("introduction");
  });

  it("reports a failed mirror fetch and truncates oversized bodies at 20,000 characters", async () => {
    const failing = await setup("en", {
      fetchText: vi.fn(async () => {
        throw new Error("404");
      }),
    });
    const error = (await failing.call("get_section", { slug: "introduction" })) as WebMcpError;
    expect(error.error).toContain("https://2022.cat/en/introduction");

    const long = await setup("en", {
      fetchText: vi.fn(async () => `# INTRO\n\n## Title\n\n${"x".repeat(25_000)}`),
    });
    const result = (await long.call("get_section", { slug: "introduction" })) as WebMcpSectionResult;
    expect(result.truncated).toBe(true);
    expect(result.markdown.length).toBeLessThanOrEqual(20_000);
    expect(result.note).toContain("https://2022.cat/en/introduction");
  });
});

describe("list_proposals", () => {
  it("filters by goal and sphere and validates the ranges (AE5)", async () => {
    const { call, onSuccess } = await setup("en");
    const goal = (await call("list_proposals", { goalId: 9 })) as WebMcpProposalsResult;
    expect(goal.count).toBe(5);
    expect(goal.proposals.map((row) => row.slug)).toEqual([1, 2, 3, 4, 5].map((n) => `/sphere-3/goal-9/action-9-${n}`));
    for (const row of goal.proposals) expect(row.url).toMatch(/^https:\/\/2022\.cat\/en\/sphere-3\/goal-9\/action-9-/);

    const sphere = (await call("list_proposals", { sphereId: 2 })) as WebMcpProposalsResult;
    expect(sphere.count).toBe(35);

    const badSphere = (await call("list_proposals", { sphereId: 4 })) as WebMcpError;
    expect(badSphere.error).toMatch(/1.*3/);
    const badGoal = (await call("list_proposals", { goalId: 0 })) as WebMcpError;
    expect(badGoal.error).toMatch(/1.*12/);
    expect(onSuccess).toHaveBeenCalledTimes(2);
  });

  it("rejects a goal that does not belong to the sphere", async () => {
    const { call, onSuccess } = await setup("en");
    const mismatch = (await call("list_proposals", { sphereId: 1, goalId: 9 })) as WebMcpError;
    expect(mismatch.error).toContain("1, 2, 3, 4");
    expect(onSuccess).not.toHaveBeenCalled();
    const match = (await call("list_proposals", { sphereId: 3, goalId: 9 })) as WebMcpProposalsResult;
    expect(match.count).toBe(5);
    expect(onSuccess).toHaveBeenCalledWith("list_proposals");
  });

  it("returns all 91 actions in numeric order in every language", async () => {
    for (const locale of ["ca", "en", "es"] as const) {
      const { call } = await setup(locale);
      const all = (await call("list_proposals", {})) as WebMcpProposalsResult;
      expect(all.count).toBe(91);
      expect(all.proposals[0].slug).toBe("/sphere-1/goal-1/action-1-1");
      expect(all.proposals[90].slug).toBe("/sphere-3/goal-12/action-12-5");
      const slugs = all.proposals.map((row) => row.slug);
      expect(slugs.indexOf("/sphere-1/goal-1/action-1-9")).toBeLessThan(slugs.indexOf("/sphere-1/goal-2/action-2-1"));
    }
  });

  it("builds the index on a cold page and reports an unavailable index", async () => {
    const docs = corpora.en;
    let built = false;
    const ensureIndex = vi.fn(async () => {
      built = true;
      return true;
    });
    const warm = await setup("en", { ensureIndex, getCorpusDocuments: () => (built ? docs : null) });
    const result = (await warm.call("list_proposals", { goalId: 1 })) as WebMcpProposalsResult;
    expect(ensureIndex).toHaveBeenCalledWith("en");
    expect(result.count).toBe(9);

    const cold = await setup("en", { ensureIndex: async () => false, getCorpusDocuments: () => null });
    const error = (await cold.call("list_proposals", {})) as WebMcpError;
    expect(error.error).toContain("index");
    const metadata = (await cold.call("get_document_metadata", {})) as WebMcpError;
    expect(metadata.error).toContain("index");
  });
});

describe("get_document_metadata", () => {
  it("returns the localized record with citation, hierarchy and downloads (AE6)", async () => {
    const { call } = await setup("es");
    const result = (await call("get_document_metadata", {})) as WebMcpMetadataResult;
    expect(result.title).toBe(DOCUMENT_TITLE.es);
    expect(result.author).toBe("Grup de Treball Catalunya 2022");
    expect(result.year).toBe(2021);
    expect(result.doi).toBe("https://doi.org/10.5281/zenodo.19500831");
    expect(result.citation.startsWith("Grup de Treball Catalunya 2022")).toBe(true);
    expect(result.spheres).toHaveLength(3);
    const goals = result.spheres.flatMap((sphere) => sphere.goals);
    expect(goals).toHaveLength(12);
    for (const goal of goals) expect(goal.actionCount).toBe(ACTION_COUNTS[goal.id as keyof typeof ACTION_COUNTS]);
    expect(result.spheres[0].url).toBe("https://2022.cat/es/ambito-1");
    expect(goals[4].url).toBe("https://2022.cat/es/ambito-2/objetivo-5");
    expect(result.downloads).toEqual({
      pdf: "https://2022.cat/documents/catalunya-2022-es.pdf",
      epub: "https://2022.cat/documents/catalunya-2022-es.epub",
      markdown: "https://2022.cat/documents/catalunya-2022-es.md",
    });
    expect(result.mcpServer).toBe("https://mcp.2022.cat");
    expect(result.language).toBe("es");
  });
});

describe("getCorpusDocuments", () => {
  it("returns null before the index is built and the documents afterwards", async () => {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => corpora.ca }))
    );
    const engine = await import("@/lib/search-engine");
    expect(engine.getCorpusDocuments("ca")).toBeNull();
    await engine.ensureIndex("ca");
    expect(engine.getCorpusDocuments("ca")).toHaveLength(147);
    expect(engine.getCorpusDocuments("en")).toBeNull();
  });
});
