import { expect, type Page } from "@playwright/test";

export type RegisteredTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: {
    type?: string;
    required?: string[];
    properties?: Record<string, { type?: string; enum?: string[]; description?: string }>;
  };
  readOnly: boolean | undefined;
};

/** Chromium 149 to 153 return the schema as a JSON string; 154+ as an object. */
export async function listWebMcpTools(page: Page): Promise<RegisteredTool[]> {
  return page.evaluate(async () => {
    const context = document.modelContext;
    if (!context) return [];
    const tools = await context.getTools();
    return tools.map((tool) => ({
      name: tool.name,
      title: tool.title ?? "",
      description: tool.description,
      inputSchema:
        typeof tool.inputSchema === "string" ? JSON.parse(tool.inputSchema) : (tool.inputSchema ?? {}),
      readOnly: tool.annotations?.readOnlyHint,
    }));
  });
}

export async function executeWebMcpTool<T>(
  page: Page,
  name: string,
  input: Record<string, unknown> = {},
): Promise<T> {
  return page.evaluate(
    async ({ toolName, args }) => {
      const context = document.modelContext;
      if (!context) throw new Error("document.modelContext is unavailable");
      const tool = (await context.getTools()).find((candidate) => candidate.name === toolName);
      if (!tool) throw new Error(`tool ${toolName} is not registered`);
      const raw = await context.executeTool(tool, JSON.stringify(args));
      return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
    },
    { toolName: name, args: input },
  );
}

export async function waitForWebMcpTools(page: Page, count = 4): Promise<RegisteredTool[]> {
  await expect
    .poll(async () => (await listWebMcpTools(page)).length, { timeout: 15_000 })
    .toBe(count);
  return listWebMcpTools(page);
}

export async function gotoStablePage(page: Page, pathname: string): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(pathname, { waitUntil: "networkidle" });
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => document.fonts?.status !== "loading");
  await expect(page.locator("body")).toBeVisible();
  await page.mouse.move(0, 0);
}
