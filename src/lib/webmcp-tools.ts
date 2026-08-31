import type { Locale } from "@/i18n/routing";
import { buildCitationText, DOCUMENT_AUTHOR, DOCUMENT_DOI_URL, DOCUMENT_TITLE } from "@/lib/citation";
import {
  ACTION_COUNTS,
  DOCUMENT_PUBLICATION_DATE,
  SPHERE_GOALS,
  type GoalId,
  type SphereId,
} from "@/lib/data/constants";
import {
  mcpServerUrl,
  webmcpMessages,
  webmcpTools,
  type WebMcpToolName,
  type WebMcpToolSpec,
} from "@/lib/data/mcp";
import { BASE_URL, buildAbsoluteUrl } from "@/lib/metadata";
import { isStaticContentSlug, SUPPLEMENTARY_PAGE_SLUGS } from "@/lib/page-registry";
import {
  buildCanonicalActionId,
  buildCanonicalActionPath,
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  localizeHref,
  parseHierarchySlug,
  toCanonicalPath,
} from "@/lib/path-utils";
import {
  MAX_SEARCH_QUERY_LENGTH,
  type SearchDocument,
  type SearchResult,
} from "@/lib/search-engine";

export type WebMcpPageData = { slug: string; title: string; rawContent: string } | null;

export type WebMcpDeps = {
  locale: Locale;
  getPageData: () => WebMcpPageData;
  search: (
    query: string,
    locale: Locale,
    options?: { scope?: SearchDocument["type"][]; limit?: number },
  ) => Promise<SearchResult[]>;
  ensureIndex: (locale: Locale) => Promise<boolean>;
  getCorpusDocuments: (locale: Locale) => SearchDocument[] | null;
  fetchText: (url: string) => Promise<string>;
  onSuccess?: (name: WebMcpToolName) => void;
};

export type WebMcpError = { error: string; hint?: string };

export type WebMcpSearchResult = {
  query: string;
  language: Locale;
  total: number;
  results: Array<{
    identifier: string;
    title: string;
    breadcrumb: string;
    slug: string;
    url: string;
    snippet: string;
  }>;
};

export type WebMcpSectionResult = {
  slug: string;
  identifier?: string;
  title: string;
  url: string;
  language: Locale;
  markdown: string;
  truncated?: boolean;
  note?: string;
};

export type WebMcpProposalsResult = {
  language: Locale;
  filter: { sphereId?: number; goalId?: number };
  count: number;
  proposals: Array<{ identifier: string; title: string; slug: string; url: string }>;
};

export type WebMcpMetadataResult = {
  title: string;
  author: string;
  year: number;
  doi: string;
  citation: string;
  language: Locale;
  website: string;
  spheres: Array<{
    id: number;
    title: string;
    url: string;
    goals: Array<{ id: number; title: string; actionCount: number; url: string }>;
  }>;
  downloads: { pdf: string; epub: string; markdown: string };
  mcpServer: string;
};

export type WebMcpToolResult =
  | WebMcpError
  | WebMcpSearchResult
  | WebMcpSectionResult
  | WebMcpProposalsResult
  | WebMcpMetadataResult;

export type WebMcpTool = Omit<ModelContextTool, "name" | "execute"> & {
  name: WebMcpToolName;
  execute: (
    input: Record<string, unknown>,
    options?: ModelContextToolExecuteOptions,
  ) => Promise<WebMcpToolResult>;
};

const SEARCH_LIMIT = 8;
const SEARCH_POOL_LIMIT = 200;
const SECTION_TEXT_CEILING = 20_000;
const SITE_HOST = new URL(BASE_URL).hostname;
const SITE_HOSTS = new Set([SITE_HOST, `www.${SITE_HOST}`]);
const DOCUMENT_TYPES: SearchDocument["type"][] = ["sphere", "goal", "action", "content"];
type SearchScope = "sphere" | "goal" | "action" | "static";
const SCOPE_TYPES: Record<SearchScope, SearchDocument["type"][]> = {
  sphere: ["sphere"],
  goal: ["goal"],
  action: ["action"],
  static: ["content"],
};

function isSearchScope(value: string): value is SearchScope {
  return Object.hasOwn(SCOPE_TYPES, value);
}

type MessageKey = keyof typeof webmcpMessages;

function message(key: MessageKey, locale: Locale, vars: Record<string, string> = {}): string {
  return webmcpMessages[key][locale].replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}

function fail(error: string, hint?: string): WebMcpError {
  return hint ? { error, hint } : { error };
}

function isError(result: WebMcpToolResult): result is WebMcpError {
  return "error" in result;
}

export function buildInputSchema(spec: WebMcpToolSpec, locale: Locale): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const param of spec.params) {
    const property: Record<string, unknown> = { type: param.type, description: param.description[locale] };
    if (param.enum) property.enum = [...param.enum];
    if (param.minimum !== undefined) property.minimum = param.minimum;
    if (param.maximum !== undefined) property.maximum = param.maximum;
    properties[param.name] = property;
    if (param.required) required.push(param.name);
  }
  const schema: Record<string, unknown> = { type: "object", properties, additionalProperties: false };
  if (required.length > 0) schema.required = required;
  return schema;
}

function canonicalizePath(input: string): string | null {
  let path = input.trim();
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      if (!SITE_HOSTS.has(url.hostname)) return null;
      path = url.pathname;
    } catch {
      return null;
    }
  }
  path = path.split(/[?#]/)[0];
  if (path.includes("..") || path.includes("\\")) return null;
  if (path.endsWith(".md")) path = path.slice(0, -3);
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+$/, "") || "/";
  return toCanonicalPath(path);
}

function toDocumentSlug(canonical: string): string | null {
  if (isStaticContentSlug(canonical)) return canonical;
  const parsed = parseHierarchySlug(canonical);
  if (!parsed) return null;
  if (parsed.kind === "sphere") return buildCanonicalSpherePath(parsed.sphereId);
  if (parsed.kind === "goal") return buildCanonicalGoalPath(parsed.sphereId, parsed.goalId);
  return buildCanonicalActionPath(
    parsed.sphereId,
    parsed.goalId,
    buildCanonicalActionId(parsed.goalId, actionNumber(parsed.actionId)),
  );
}

function isSitePage(canonical: string): boolean {
  return (
    canonical === "/" ||
    (SUPPLEMENTARY_PAGE_SLUGS as readonly string[]).includes(canonical) ||
    /^\/task-force\/[a-z0-9-]+$/.test(canonical)
  );
}

export function normalizeSectionSlug(input: string): string | null {
  const canonical = canonicalizePath(input);
  return canonical ? toDocumentSlug(canonical) : null;
}

function parseHeadings(markdown: string): { identifier?: string; title?: string } {
  let identifier: string | undefined;
  let title: string | undefined;
  for (const line of markdown.split("\n")) {
    if (identifier === undefined && line.startsWith("# ")) identifier = line.slice(2).trim();
    else if (title === undefined && line.startsWith("## ")) title = line.slice(3).trim();
    if (identifier !== undefined && title !== undefined) break;
  }
  return { identifier, title };
}

function sectionResult(slug: string, url: string, text: string, locale: Locale): WebMcpSectionResult {
  const { identifier, title } = parseHeadings(text);
  const result: WebMcpSectionResult = {
    slug,
    identifier,
    title: title ?? identifier ?? slug,
    url,
    language: locale,
    markdown: text,
  };
  if (text.length > SECTION_TEXT_CEILING) {
    result.markdown = text.slice(0, SECTION_TEXT_CEILING);
    result.truncated = true;
    result.note = message("truncated", locale, { url });
  }
  return result;
}

function parseId(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? value : Number(value);
}

function inRange(value: number | undefined, max: number): boolean {
  return value === undefined || (Number.isInteger(value) && value >= 1 && value <= max);
}

function actionNumber(actionId: string): number {
  return Number(actionId.split("-")[1]);
}

async function loadCorpus(deps: WebMcpDeps): Promise<SearchDocument[] | null> {
  const ready = await deps.ensureIndex(deps.locale);
  return ready ? deps.getCorpusDocuments(deps.locale) : null;
}

function localizedDownloads(locale: Locale): WebMcpMetadataResult["downloads"] {
  const base = `${BASE_URL}/documents/catalunya-2022-${locale}`;
  return { pdf: `${base}.pdf`, epub: `${base}.epub`, markdown: `${base}.md` };
}

async function searchDocument(input: Record<string, unknown>, deps: WebMcpDeps): Promise<WebMcpToolResult> {
  const { locale } = deps;
  const query =
    typeof input.query === "string" ? input.query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH) : "";
  if (!query) return fail(message("emptyQuery", locale), "list_proposals");
  const scope = typeof input.scope === "string" && input.scope !== "" ? input.scope : undefined;
  if (scope !== undefined && !isSearchScope(scope)) {
    return fail(
      message("invalidScope", locale, {
        scope: scope.slice(0, 40),
        scopes: Object.keys(SCOPE_TYPES).join(", "),
      }),
    );
  }
  let pool: SearchResult[];
  try {
    pool = await deps.search(query, locale, {
      scope: scope ? SCOPE_TYPES[scope] : DOCUMENT_TYPES,
      limit: SEARCH_POOL_LIMIT,
    });
  } catch {
    return fail(message("indexUnavailable", locale));
  }
  pool = pool.filter((result) => result.slug !== "/");
  if (pool.length === 0) return fail(message("noResults", locale, { query }), "list_proposals");
  return {
    query,
    language: locale,
    total: pool.length,
    results: pool.slice(0, SEARCH_LIMIT).map((result) => ({
      identifier: result.identifier,
      title: result.title,
      breadcrumb: result.breadcrumb,
      slug: result.slug,
      url: buildAbsoluteUrl(result.slug, locale),
      snippet: result.snippet,
    })),
  };
}

async function readDocumentSection(canonical: string, deps: WebMcpDeps): Promise<WebMcpToolResult> {
  const { locale } = deps;
  const url = buildAbsoluteUrl(canonical, locale);
  let text: string;
  try {
    text = await deps.fetchText(`${localizeHref(canonical, locale)}.md`);
  } catch {
    return fail(message("mirrorUnavailable", locale, { url }));
  }
  return sectionResult(canonical, url, text, locale);
}

async function getSection(input: Record<string, unknown>, deps: WebMcpDeps): Promise<WebMcpToolResult> {
  const { locale } = deps;
  const requested = typeof input.slug === "string" ? input.slug.trim() : "";
  if (!requested) {
    const page = deps.getPageData();
    if (!page) return fail(message("noCurrentPage", locale));
    const canonical = normalizeSectionSlug(page.slug);
    if (canonical) return readDocumentSection(canonical, deps);
    return {
      slug: page.slug,
      title: page.title,
      url: buildAbsoluteUrl(page.slug, locale),
      language: locale,
      markdown: page.rawContent,
    };
  }
  const canonical = canonicalizePath(requested);
  const documentSlug = canonical ? toDocumentSlug(canonical) : null;
  if (documentSlug) return readDocumentSection(documentSlug, deps);
  if (canonical && isSitePage(canonical)) {
    return fail(
      message("notReadable", locale, { slug: requested, url: buildAbsoluteUrl(canonical, locale) }),
      "search_document",
    );
  }
  return fail(message("unknownSlug", locale, { slug: requested }), "search_document");
}

async function listProposals(input: Record<string, unknown>, deps: WebMcpDeps): Promise<WebMcpToolResult> {
  const { locale } = deps;
  const sphereId = parseId(input.sphereId);
  const goalId = parseId(input.goalId);
  if (!inRange(sphereId, 3)) return fail(message("invalidSphere", locale));
  if (!inRange(goalId, 12)) return fail(message("invalidGoal", locale));
  if (
    sphereId !== undefined &&
    goalId !== undefined &&
    !SPHERE_GOALS[sphereId as SphereId].includes(goalId as GoalId)
  ) {
    return fail(
      message("goalNotInSphere", locale, {
        goalId: String(goalId),
        sphereId: String(sphereId),
        goals: SPHERE_GOALS[sphereId as SphereId].join(", "),
      }),
      "list_proposals",
    );
  }
  const docs = await loadCorpus(deps);
  if (!docs) return fail(message("indexUnavailable", locale));
  const goals = sphereId !== undefined ? SPHERE_GOALS[sphereId as SphereId] : undefined;
  const proposals = docs
    .flatMap((doc) => {
      if (doc.type !== "action") return [];
      const parsed = parseHierarchySlug(doc.slug);
      return parsed?.kind === "action" ? [{ doc, goalId: parsed.goalId, order: actionNumber(parsed.actionId) }] : [];
    })
    .filter((row) => (goals ? goals.includes(row.goalId) : true))
    .filter((row) => (goalId !== undefined ? row.goalId === goalId : true))
    .sort((a, b) => a.goalId - b.goalId || a.order - b.order)
    .map(({ doc }) => ({
      identifier: doc.identifier,
      title: doc.title,
      slug: doc.slug,
      url: buildAbsoluteUrl(doc.slug, locale),
    }));
  const filter: WebMcpProposalsResult["filter"] = {};
  if (sphereId !== undefined) filter.sphereId = sphereId;
  if (goalId !== undefined) filter.goalId = goalId;
  return { language: locale, filter, count: proposals.length, proposals };
}

async function getDocumentMetadata(deps: WebMcpDeps): Promise<WebMcpToolResult> {
  const { locale } = deps;
  const docs = await loadCorpus(deps);
  if (!docs) return fail(message("indexUnavailable", locale));
  const titles = new Map(docs.map((doc) => [doc.slug, doc.title]));
  const titleOf = (slug: string) => titles.get(slug) ?? slug;
  const spheres = (Object.keys(SPHERE_GOALS).map(Number) as SphereId[]).map((sphereId) => {
    const sphereSlug = buildCanonicalSpherePath(sphereId);
    return {
      id: sphereId,
      title: titleOf(sphereSlug),
      url: buildAbsoluteUrl(sphereSlug, locale),
      goals: SPHERE_GOALS[sphereId].map((goalId: GoalId) => {
        const goalSlug = buildCanonicalGoalPath(sphereId, goalId);
        return {
          id: goalId,
          title: titleOf(goalSlug),
          actionCount: ACTION_COUNTS[goalId],
          url: buildAbsoluteUrl(goalSlug, locale),
        };
      }),
    };
  });
  const website = buildAbsoluteUrl("/", locale);
  return {
    title: DOCUMENT_TITLE[locale],
    author: DOCUMENT_AUTHOR,
    year: Number(DOCUMENT_PUBLICATION_DATE.slice(0, 4)),
    doi: DOCUMENT_DOI_URL,
    citation: buildCitationText(website, locale),
    language: locale,
    website,
    spheres,
    downloads: localizedDownloads(locale),
    mcpServer: mcpServerUrl,
  };
}

const HANDLERS: Record<
  WebMcpToolName,
  (input: Record<string, unknown>, deps: WebMcpDeps) => Promise<WebMcpToolResult>
> = {
  search_document: searchDocument,
  get_section: getSection,
  list_proposals: listProposals,
  get_document_metadata: (_input, deps) => getDocumentMetadata(deps),
};

export function createWebMcpTools(deps: WebMcpDeps): WebMcpTool[] {
  return webmcpTools.map((spec) => ({
    name: spec.name,
    title: spec.title[deps.locale],
    description: spec.description[deps.locale],
    inputSchema: buildInputSchema(spec, deps.locale),
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const result = await HANDLERS[spec.name](input ?? {}, deps);
      if (!isError(result)) deps.onSuccess?.(spec.name);
      return result;
    },
  }));
}
