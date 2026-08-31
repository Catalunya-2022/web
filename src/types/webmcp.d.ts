type ModelContextToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
};

type ModelContextToolExecuteOptions = {
  signal?: AbortSignal;
};

type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: ModelContextToolAnnotations;
  execute: (
    input: Record<string, unknown>,
    options: ModelContextToolExecuteOptions,
  ) => unknown;
};

type ModelContextRegisterToolOptions = {
  signal?: AbortSignal;
  exposedTo?: string[];
};

type ModelContextRegisteredTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown> | string;
  window: Window;
  origin: string;
  annotations?: ModelContextToolAnnotations;
};

interface ModelContext extends EventTarget {
  registerTool(
    tool: ModelContextTool,
    options?: ModelContextRegisterToolOptions,
  ): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<ModelContextRegisteredTool[]>;
  executeTool(
    tool: ModelContextRegisteredTool,
    input?: string | Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ): Promise<string | null>;
  ontoolchange: ((this: ModelContext, event: Event) => unknown) | null;
}

interface Document {
  readonly modelContext?: ModelContext;
}
