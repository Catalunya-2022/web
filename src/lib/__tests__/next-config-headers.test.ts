import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../../../next.config";

type HeaderRule = { source: string; headers: Array<{ key: string; value: string }> };

async function siteWideHeaders(): Promise<Array<{ key: string; value: string }>> {
  const rules = (await nextConfig.headers?.()) as HeaderRule[];
  return rules.find((rule) => rule.source === "/(.*)")?.headers ?? [];
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
