import { afterEach, describe, expect, it, vi } from "vitest";

type MockSearchDocument = {
  slug: string;
  type: "sphere" | "goal" | "action" | "content" | "member" | "supplementary";
  identifier: string;
  title: string;
  breadcrumb: string;
  body: string;
};

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function jsonResponse(data: MockSearchDocument[]) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue(data),
  };
}

describe("search", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("throws when the search index cannot be loaded", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const { search } = await import("../search-engine");

    await expect(search("economy", "en")).rejects.toThrow(
      'Search index for locale "en" is unavailable'
    );
  });

  it("aborts stale locale loads when the requested locale changes", async () => {
    const enFetch = deferred<ReturnType<typeof jsonResponse>>();
    const esFetch = deferred<ReturnType<typeof jsonResponse>>();

    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith("search-corpus-en.json")) {
          init?.signal?.addEventListener("abort", () => {
            enFetch.reject(new Error("aborted"));
          });
          return enFetch.promise;
        }

        if (url.endsWith("search-corpus-es.json")) {
          return esFetch.promise;
        }

        throw new Error(`Unexpected fetch URL: ${url}`);
      })
    );

    const { ensureIndex, getCorpusStats } = await import("../search-engine");

    const enPromise = ensureIndex("en");
    const esPromise = ensureIndex("es");

    esFetch.resolve(
      jsonResponse([
        {
          slug: "/resources",
          type: "supplementary",
          identifier: "Recursos",
          title: "Recursos",
          breadcrumb: "",
          body: "Recursos disponibles",
        },
      ])
    );

    await expect(enPromise).resolves.toBe(false);
    await expect(esPromise).resolves.toBe(true);
    expect(getCorpusStats("en")).toBeNull();
    expect(getCorpusStats("es")).toEqual({
      spheres: 0,
      goals: 0,
      actions: 0,
      documents: 1,
      members: 0,
    });
  });

  it("dedupes normalized matches and ranks title matches before body-only matches", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            slug: "/title-match",
            type: "content",
            identifier: "Món Rural Strategy",
            title: "Món Rural Strategy",
            breadcrumb: "",
            body: "Món rural strategy and implementation details.",
          },
          {
            slug: "/body-match",
            type: "content",
            identifier: "Economic update",
            title: "Economic update",
            breadcrumb: "",
            body: "This plan supports the món rural through new measures.",
          },
        ])
      )
    );

    const { search } = await import("../search-engine");

    const results = await search("món rural", "ca");

    expect(results.map((result) => result.slug)).toEqual([
      "/title-match",
      "/body-match",
    ]);
    expect(new Set(results.map((result) => result.slug)).size).toBe(results.length);
  });

  it("reuses the preload fetch and exposes stats from the cached corpus", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          slug: "/sphere-1",
          type: "sphere",
          identifier: "Sphere 1",
          title: "Sphere 1",
          breadcrumb: "",
          body: "Society transformation",
        },
        {
          slug: "/sphere-1/goal-1",
          type: "goal",
          identifier: "Goal 1",
          title: "Goal 1",
          breadcrumb: "",
          body: "Goal content",
        },
        {
          slug: "/sphere-1/goal-1/action-1-1",
          type: "action",
          identifier: "Action 1.1",
          title: "Action 1.1",
          breadcrumb: "",
          body: "Action content",
        },
        {
          slug: "/introduction",
          type: "content",
          identifier: "Introduction",
          title: "Introduction",
          breadcrumb: "",
          body: "Catalunya 2022 introduction",
        },
        {
          slug: "/resources",
          type: "supplementary",
          identifier: "Resources",
          title: "Resources",
          breadcrumb: "",
          body: "Downloads",
        },
        {
          slug: "/task-force/member",
          type: "member",
          identifier: "Member",
          title: "Member",
          breadcrumb: "",
          body: "Task force member bio",
        },
      ])
    );

    vi.stubGlobal("fetch", fetchMock);

    const { getCorpusStats, preloadCorpus, search } = await import("../search-engine");

    preloadCorpus("en");
    await search("Catalunya", "en");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getCorpusStats("en")).toEqual({
      spheres: 1,
      goals: 1,
      actions: 1,
      documents: 2,
      members: 1,
    });
  });
});
