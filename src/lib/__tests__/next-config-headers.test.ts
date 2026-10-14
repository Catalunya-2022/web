import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../../../next.config";

type HeaderRule = { source: string; headers: Array<{ key: string; value: string }> };

async function headerRules(): Promise<HeaderRule[]> {
  return (await nextConfig.headers?.()) as HeaderRule[];
}

async function siteWideHeaders(): Promise<Array<{ key: string; value: string }>> {
  return (await headerRules()).find((rule) => rule.source === "/(.*)")?.headers ?? [];
}

function hreflangLink(urls: Array<[string, string]>): string {
  return urls.map(([locale, url]) => `<${url}>; rel="alternate"; hreflang="${locale}"`).join(", ");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Origin-Trial header", () => {
  it("is served on every route when the WebMCP token is configured", async () => {
    vi.stubEnv("WEBMCP_ORIGIN_TRIAL_TOKEN", "AbCdEf==");
    const headers = await siteWideHeaders();
    expect(headers.filter((header) => header.key === "Origin-Trial")).toEqual([
      { key: "Origin-Trial", value: "AbCdEf==" },
    ]);
    expect(headers.some((header) => header.key === "Content-Signal")).toBe(true);
  });

  it("is absent when no token is configured", async () => {
    vi.stubEnv("WEBMCP_ORIGIN_TRIAL_TOKEN", "");
    const headers = await siteWideHeaders();
    expect(headers.some((header) => header.key === "Origin-Trial")).toBe(false);
  });
});

describe("document download hreflang Link headers", () => {
  it("lists the whole cluster on every trilingual download and the Acord de Govern pair", async () => {
    const rules = await headerRules();
    const linkOf = (source: string) =>
      rules.find((rule) => rule.source === source)?.headers.find((header) => header.key === "Link")?.value;

    for (const ext of ["pdf", "epub", "md"]) {
      const cluster = hreflangLink([
        ["ca", `https://2022.cat/documents/catalunya-2022-ca.${ext}`],
        ["en", `https://2022.cat/documents/catalunya-2022-en.${ext}`],
        ["es", `https://2022.cat/documents/catalunya-2022-es.${ext}`],
      ]);
      expect(linkOf(`/documents/catalunya-2022-ca.${ext}`)).toBe(cluster);
      expect(linkOf(`/documents/catalunya-2022-en.${ext}`)).toBe(cluster);
      expect(linkOf(`/documents/catalunya-2022-es.${ext}`)).toBe(cluster);
    }

    const acord = hreflangLink([
      ["ca", "https://2022.cat/documents/acord-de-govern-ca.pdf"],
      ["es", "https://2022.cat/documents/acord-de-govern-es.pdf"],
    ]);
    expect(linkOf("/documents/acord-de-govern-ca.pdf")).toBe(acord);
    expect(linkOf("/documents/acord-de-govern-es.pdf")).toBe(acord);
    expect(rules.filter((rule) => rule.source.startsWith("/documents/") && rule.headers.some((h) => h.key === "Link"))).toHaveLength(11);
  });
});

describe("search corpus headers", () => {
  it("keeps the corpus files out of the index without changing their caching", async () => {
    const rule = (await headerRules()).find((candidate) => candidate.source === "/search-corpus-:locale(ca|en|es).json");
    expect(rule?.headers).toEqual([
      { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
      { key: "X-Robots-Tag", value: "noindex" },
    ]);
  });
});
