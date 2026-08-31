// @vitest-environment jsdom

import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyPageProvider } from "@/components/content/copy-page-context";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { WebMcpTools } from "@/components/layout/webmcp-tools";
import type { Locale } from "@/i18n/routing";

const search = vi.fn(async () => [
  {
    slug: "/sphere-1/goal-1/action-1-1",
    type: "action" as const,
    identifier: "ACTION 1.1",
    title: "Culture",
    breadcrumb: "Action Plan",
    body: "body",
    snippet: "snippet",
  },
]);

vi.mock("@/lib/search-engine", () => ({
  MAX_SEARCH_QUERY_LENGTH: 100,
  search: (...args: unknown[]) => search(...(args as [])),
  ensureIndex: vi.fn(async () => true),
  getCorpusDocuments: vi.fn(() => []),
}));

const trackEvent = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackEvent: (name: string) => trackEvent(name) }));

const createWebMcpTools = vi.fn();
vi.mock("@/lib/webmcp-tools", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/webmcp-tools")>();
  createWebMcpTools.mockImplementation(actual.createWebMcpTools);
  return { ...actual, createWebMcpTools: (...args: Parameters<typeof actual.createWebMcpTools>) => createWebMcpTools(...args) };
});

type Registration = { tool: ModelContextTool; signal: AbortSignal | undefined };

function installModelContext(registerTool?: ModelContext["registerTool"]) {
  const registrations: Registration[] = [];
  const context = {
    registerTool:
      registerTool ??
      vi.fn(async (tool: ModelContextTool, options?: ModelContextRegisterToolOptions) => {
        registrations.push({ tool, signal: options?.signal });
      }),
  } as unknown as ModelContext;
  Object.defineProperty(document, "modelContext", { value: context, configurable: true });
  return { context, registrations };
}

function removeModelContext() {
  Object.defineProperty(document, "modelContext", { value: undefined, configurable: true });
}

function Page({
  locale,
  withPage = true,
  slug = "/sphere-1/goal-1/action-1-1",
  title = "Action 1.1",
  rawContent = "raw",
}: {
  locale: Locale;
  withPage?: boolean;
  slug?: string;
  title?: string;
  rawContent?: string;
}) {
  return (
    <CopyPageProvider>
      {withPage && <CopyPageSetter title={title} slug={slug} rawContent={rawContent} locale={locale} citable />}
      <WebMcpTools locale={locale} />
    </CopyPageProvider>
  );
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

beforeEach(() => {
  trackEvent.mockClear();
  createWebMcpTools.mockClear();
  search.mockClear();
});

afterEach(() => {
  cleanup();
  removeModelContext();
});

describe("WebMcpTools", () => {
  it("does nothing when the browser has no WebMCP API (AE7)", async () => {
    removeModelContext();
    render(<Page locale="en" />);
    await flush();
    expect(createWebMcpTools).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("registers the four read-only tools in the page language", async () => {
    const { registrations } = installModelContext();
    render(<Page locale="en" />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    expect(registrations.map((entry) => entry.tool.name).sort()).toEqual([
      "get_document_metadata",
      "get_section",
      "list_proposals",
      "search_document",
    ]);
    for (const entry of registrations) {
      expect(entry.tool.annotations?.readOnlyHint).toBe(true);
      expect(entry.signal).toBeInstanceOf(AbortSignal);
      expect(entry.signal?.aborted).toBe(false);
    }
    const section = registrations.find((entry) => entry.tool.name === "get_section");
    expect(section?.tool.description).toContain("this page's language");
  });

  it("re-registers in the new language when the locale changes and aborts the old set (AE8)", async () => {
    const { registrations } = installModelContext();
    const view = render(<Page locale="en" />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    const first = registrations.slice(0, 4);

    view.rerender(<Page locale="es" />);
    await waitFor(() => expect(registrations).toHaveLength(8));
    for (const entry of first) expect(entry.signal?.aborted).toBe(true);
    const second = registrations.slice(4);
    for (const entry of second) expect(entry.signal?.aborted).toBe(false);
    expect(second.find((entry) => entry.tool.name === "get_section")?.tool.description).toContain(
      "idioma de esta página"
    );
  });

  it("aborts the registration signal on unmount", async () => {
    const { registrations } = installModelContext();
    const view = render(<Page locale="ca" />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    view.unmount();
    for (const entry of registrations) expect(entry.signal?.aborted).toBe(true);
  });

  it("swallows registration rejections without console errors", async () => {
    const registerTool = vi.fn(async () => {
      throw new DOMException("already registered", "NotAllowedError");
    });
    installModelContext(registerTool as unknown as ModelContext["registerTool"]);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Page locale="en" />);
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(4));
    await flush();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("records a Plausible event on a successful call and none on a validation failure (AE9)", async () => {
    const { registrations } = installModelContext();
    render(<Page locale="en" />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    const searchTool = registrations.find((entry) => entry.tool.name === "search_document")!.tool;

    await searchTool.execute({ query: "" }, { signal: new AbortController().signal });
    expect(trackEvent).not.toHaveBeenCalled();

    await searchTool.execute({ query: "culture" }, { signal: new AbortController().signal });
    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith("WebMCP: search_document");
  });

  it("serves the newly visited page through an already registered tool after client navigation", async () => {
    const { registrations } = installModelContext();
    const view = render(<Page locale="en" slug="/press" title="Press" rawContent="first" />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    const sectionTool = registrations.find((entry) => entry.tool.name === "get_section")!.tool;

    view.rerender(<Page locale="en" slug="/organizations" title="Organizations" rawContent="second" />);
    await flush();

    const result = (await sectionTool.execute({}, { signal: new AbortController().signal })) as {
      slug?: string;
      markdown?: string;
    };
    expect(result.slug).toBe("/organizations");
    expect(result.markdown).toBe("second");
    expect(registrations).toHaveLength(4);
  });

  it("reads the current page through the copy-page context", async () => {
    const { registrations } = installModelContext();
    render(<Page locale="en" withPage={false} />);
    await waitFor(() => expect(registrations).toHaveLength(4));
    const sectionTool = registrations.find((entry) => entry.tool.name === "get_section")!.tool;
    const missing = (await sectionTool.execute({}, { signal: new AbortController().signal })) as { error?: string };
    expect(missing.error).toContain("introduction");
  });
});
