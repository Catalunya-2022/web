// @vitest-environment jsdom

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyPageProvider } from "@/components/content/copy-page-context";
import { WebMcpTools } from "@/components/layout/webmcp-tools";

vi.mock("@/lib/search-engine", () => {
  throw new Error("chunk load failed");
});

const registerTool = vi.fn(async () => {});

function installModelContext() {
  Object.defineProperty(document, "modelContext", {
    value: { registerTool } as unknown as ModelContext,
    configurable: true,
  });
}

function removeModelContext() {
  Object.defineProperty(document, "modelContext", { value: undefined, configurable: true });
}

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

afterEach(() => {
  cleanup();
  removeModelContext();
});

describe("WebMcpTools dynamic import failure", () => {
  it("swallows a rejected dynamic import and registers nothing", async () => {
    installModelContext();
    render(
      <CopyPageProvider>
        <WebMcpTools locale="en" />
      </CopyPageProvider>
    );
    await flush();
    await flush();
    expect(registerTool).not.toHaveBeenCalled();
  });
});
