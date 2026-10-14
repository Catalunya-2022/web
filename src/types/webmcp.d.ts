type ModelContextToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
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

type ToolActivatedEvent = Event & { readonly toolName: string };

type ToolCancelEvent = Event & { readonly toolName: string };

interface ModelContext extends EventTarget {
  registerTool(
    tool: ModelContextTool,
    options?: ModelContextRegisterToolOptions,
  ): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<ModelContextRegisteredTool[]>;
  executeTool(
    tool: ModelContextRegisteredTool,
    input?: Record<string, unknown> | string,
    options?: { signal?: AbortSignal },
  ): Promise<string | null>;
  ontoolchange: ((this: ModelContext, event: Event) => unknown) | null;
  ontoolactivated: ((this: ModelContext, event: ToolActivatedEvent) => unknown) | null;
  ontoolcancel: ((this: ModelContext, event: ToolCancelEvent) => unknown) | null;
}

interface Document {
  readonly modelContext?: ModelContext;
}
