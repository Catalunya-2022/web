import type { Trilingual } from "@/i18n/routing";

// --- Section labels (red uppercase subtitles — matches Resources/Press pattern) ---

export const mcpSectionLabels = {
  intro: { ca: "Protocol", en: "Protocol", es: "Protocolo" } satisfies Trilingual<string>,
  server: { ca: "Servidor", en: "Server", es: "Servidor" } satisfies Trilingual<string>,
  connect: { ca: "Connexió", en: "Connection", es: "Conexión" } satisfies Trilingual<string>,
  capabilities: { ca: "Capacitats", en: "Capabilities", es: "Capacidades" } satisfies Trilingual<string>,
  technical: { ca: "Referència", en: "Reference", es: "Referencia" } satisfies Trilingual<string>,
  examples: { ca: "Exemples", en: "Examples", es: "Ejemplos" } satisfies Trilingual<string>,
};

// --- Section headings ---

export const mcpSectionHeadings = {
  intro: { ca: "Què és MCP?", en: "What is MCP?", es: "¿Qué es MCP?" } satisfies Trilingual<string>,
  server: {
    ca: "El Servidor MCP de Catalunya 2022",
    en: "The Catalunya 2022 MCP Server",
    es: "El Servidor MCP de Catalunya 2022",
  } satisfies Trilingual<string>,
  capabilities: {
    ca: "Capacitats del servidor",
    en: "Server Capabilities",
    es: "Capacidades del servidor",
  } satisfies Trilingual<string>,
  tools: { ca: "Eines", en: "Tools", es: "Herramientas" } satisfies Trilingual<string>,
  resources: { ca: "Recursos", en: "Resources", es: "Recursos" } satisfies Trilingual<string>,
  prompts: {
    ca: "Plantilles guiades",
    en: "Guided Prompts",
    es: "Plantillas guiadas",
  } satisfies Trilingual<string>,
  connect: {
    ca: "Com connectar-s'hi",
    en: "How to Connect",
    es: "Cómo conectarse",
  } satisfies Trilingual<string>,
  examples: {
    ca: "Què pots preguntar?",
    en: "What Can You Ask?",
    es: "¿Qué puedes preguntar?",
  } satisfies Trilingual<string>,
  technical: {
    ca: "Detalls tècnics",
    en: "Technical Details",
    es: "Detalles técnicos",
  } satisfies Trilingual<string>,
};

export const mcpFieldLabels = {
  tool: { ca: "Eina", en: "Tool", es: "Herramienta" } satisfies Trilingual<string>,
  uri: { ca: "URI", en: "URI", es: "URI" } satisfies Trilingual<string>,
  prompt: { ca: "Prompt", en: "Prompt", es: "Prompt" } satisfies Trilingual<string>,
  description: {
    ca: "Descripció",
    en: "Description",
    es: "Descripción",
  } satisfies Trilingual<string>,
  protocol: { ca: "Protocol", en: "Protocol", es: "Protocolo" } satisfies Trilingual<string>,
  endpoint: { ca: "Endpoint", en: "Endpoint", es: "Endpoint" } satisfies Trilingual<string>,
  rateLimit: {
    ca: "Límit de peticions",
    en: "Rate limit",
    es: "Límite de peticiones",
  } satisfies Trilingual<string>,
  authentication: {
    ca: "Autenticació",
    en: "Authentication",
    es: "Autenticación",
  } satisfies Trilingual<string>,
  languages: {
    ca: "Idiomes",
    en: "Languages",
    es: "Idiomas",
  } satisfies Trilingual<string>,
  content: { ca: "Contingut", en: "Content", es: "Contenido" } satisfies Trilingual<string>,
};

// --- Intro paragraph ---

export const mcpIntroText = {
  ca: "El Model Context Protocol (MCP) és un estàndard obert que permet als assistents d'IA connectar-se a fonts de dades i eines externes. Penseu-hi com un endoll universal que permet a qualsevol IA compatible (Claude, ChatGPT, Codex i d'altres) llegir i interactuar amb contingut estructurat.",
  en: "The Model Context Protocol (MCP) is an open standard that lets AI assistants connect to external data sources and tools. Think of it as a universal plug that allows any compatible AI (Claude, ChatGPT, Codex, and others) to read and interact with structured content.",
  es: "El Model Context Protocol (MCP) es un estándar abierto que permite a los asistentes de IA conectarse a fuentes de datos y herramientas externas. Piénsalo como un enchufe universal que permite a cualquier IA compatible (Claude, ChatGPT, Codex y otros) leer e interactuar con contenido estructurado.",
} satisfies Trilingual<string>;

export const mcpIntroLearnMore = {
  ca: "Per saber-ne més sobre MCP, visiteu el lloc web oficial del protocol:",
  en: "To learn more about MCP, visit the official website of the protocol:",
  es: "Para saber más sobre MCP, visita el sitio web oficial del protocolo:",
} satisfies Trilingual<string>;

// --- Server description ---

export const mcpServerDescription = {
  ca: "El servidor MCP de Catalunya 2022 fa que tot el document Catalunya 2022 (3 àmbits, 12 objectius i 91 propostes d'acció) sigui consultable per qualsevol assistent d'IA. Ofereix eines de cerca de text complet i recuperació de seccions, recursos per accedir a la jerarquia del document i als perfils dels col·laboradors, i plantilles guiades per explorar àmbits o analitzar propostes concretes. Disponible en 3 idiomes (català, anglès i castellà), sense autenticació.",
  en: "The Catalunya 2022 MCP server makes the entire Catalunya 2022 document (3 spheres, 12 goals, and 91 action proposals) queryable by any AI assistant. It provides tools for full-text search and section retrieval, resources for accessing the document hierarchy and contributor profiles, and guided prompts for exploring spheres or analyzing specific proposals. Available in 3 languages (Catalan, English, and Spanish), no authentication required.",
  es: "El servidor MCP de Catalunya 2022 hace que todo el documento Catalunya 2022 (3 ámbitos, 12 objetivos y 91 propuestas de acción) sea consultable por cualquier asistente de IA. Ofrece herramientas de búsqueda de texto completo y recuperación de secciones, recursos para acceder a la jerarquía del documento y a los perfiles de los colaboradores, y plantillas guiadas para explorar ámbitos o analizar propuestas concretas. Disponible en 3 idiomas (catalán, inglés y castellano), sin autenticación.",
} satisfies Trilingual<string>;

// --- Capability types ---

export type McpTool = {
  name: string;
  description: Trilingual<string>;
};

export type McpResource = {
  uri: string;
  description: Trilingual<string>;
};

export type McpPrompt = {
  name: string;
  description: Trilingual<string>;
};

export type McpClientConfig = {
  id: string;
  name: string | Trilingual<string>;
  instructions: Trilingual<string>;
  code: string;
  language: string;
  note?: Trilingual<string>;
};

// --- Tools ---

export const mcpTools: McpTool[] = [
  {
    name: "get_document_metadata",
    description: {
      ca: "Obté l'estructura completa: 3 àmbits, 12 objectius, 91 accions amb títols, slugs i llista de col·laboradors. El punt de partida per a la navegació.",
      en: "Get the complete structure: 3 spheres, 12 goals, 91 actions with titles, slugs, and contributor list. The starting point for navigation.",
      es: "Obtén la estructura completa: 3 ámbitos, 12 objetivos, 91 acciones con títulos, slugs y lista de colaboradores. El punto de partida para la navegación.",
    },
  },
  {
    name: "search_document",
    description: {
      ca: "Cerca de text complet a tot el contingut. Retorna fins a 10 resultats amb fragments. Gestiona automàticament els diacrítics del català i el castellà (p. ex. \u201ceducacio\u201d troba \u201ceducació\u201d). Pot filtrar per tipus de secció.",
      en: "Full-text keyword search across all content. Returns up to 10 results with snippets. Handles Catalan/Spanish diacritics automatically (e.g. \u201ceducacio\u201d matches \u201ceducació\u201d). Can filter by section type.",
      es: "Búsqueda de texto completo en todo el contenido. Devuelve hasta 10 resultados con fragmentos. Gestiona automáticamente los diacríticos del catalán y el castellano (p. ej. \u201ceducacio\u201d encuentra \u201ceducació\u201d). Puede filtrar por tipo de sección.",
    },
  },
  {
    name: "get_section",
    description: {
      ca: "Recupera el text complet de qualsevol secció pel seu slug canònic (p. ex. sphere-1/goal-2/action-2-1). Retorna contingut Markdown amb enllaços al web.",
      en: "Retrieve the full text of any section by its canonical slug (e.g. sphere-1/goal-2/action-2-1). Returns Markdown content with links to the website.",
      es: "Recupera el texto completo de cualquier sección por su slug canónico (p. ej. sphere-1/goal-2/action-2-1). Devuelve contenido Markdown con enlaces al sitio web.",
    },
  },
  {
    name: "list_proposals",
    description: {
      ca: "Llista les 91 propostes d'acció, opcionalment filtrades per àmbit (1–3) o objectiu (1–12). Retorna IDs, títols, slugs i URLs del web en ordre numèric correcte.",
      en: "List all 91 action proposals, optionally filtered by sphere (1–3) or goal (1–12). Returns action IDs, titles, slugs, and website URLs in correct numeric order.",
      es: "Lista las 91 propuestas de acción, opcionalmente filtradas por ámbito (1–3) u objetivo (1–12). Devuelve IDs, títulos, slugs y URLs del sitio web en orden numérico correcto.",
    },
  },
];

// --- Resources ---

export const mcpResources: McpResource[] = [
  {
    uri: "document://catalunya2022/manifest",
    description: {
      ca: "Jerarquia completa del document amb títols trilingües, l'índex complet com a JSON estructurat.",
      en: "Full document hierarchy with trilingual titles, the complete table of contents as structured JSON.",
      es: "Jerarquía completa del documento con títulos trilingües, el índice completo como JSON estructurado.",
    },
  },
  {
    uri: "document://catalunya2022/{locale}/{slug}",
    description: {
      ca: "Qualsevol secció en Markdown. El locale és ca, en o es. El slug segueix el patró canònic (p. ex. sphere-1/goal-2).",
      en: "Any section in Markdown. Locale is ca, en, or es. Slug follows the canonical pattern (e.g. sphere-1/goal-2).",
      es: "Cualquier sección en Markdown. El locale es ca, en o es. El slug sigue el patrón canónico (p. ej. sphere-1/goal-2).",
    },
  },
  {
    uri: "document://catalunya2022/contributors",
    description: {
      ca: "Els 30 perfils d'experts del grup de treball amb ròls, biografies, fotos i enllaços socials trilingües.",
      en: "All 30 task force expert profiles with trilingual roles, bios, photos, and social links.",
      es: "Los 30 perfiles de expertos del grupo de trabajo con roles, biografías, fotos y enlaces sociales trilingües.",
    },
  },
];

// --- Prompts ---

export const mcpPrompts: McpPrompt[] = [
  {
    name: "explore-document",
    description: {
      ca: "Visita guiada per l'estructura del document i els temes clau. La IA crida get_document_metadata, ofereix una visió general i proposa aprofundir.",
      en: "Guided tour of the document structure and key themes. The AI calls get_document_metadata, gives an overview, and offers to dive deeper.",
      es: "Visita guiada por la estructura del documento y los temas clave. La IA llama get_document_metadata, ofrece una visión general y propone profundizar.",
    },
  },
  {
    name: "summarize-sphere",
    description: {
      ca: "Resum en profunditat d'un àmbit (1, 2 o 3). Llegeix la visió general de l'àmbit, tots els seus objectius i llista totes les accions.",
      en: "Deep summary of a sphere (1, 2, or 3). Reads the sphere overview, all its goals, and lists all actions within it.",
      es: "Resumen en profundidad de un ámbito (1, 2 o 3). Lee la visión general del ámbito, todos sus objetivos y lista todas las acciones.",
    },
  },
  {
    name: "analyze-proposal",
    description: {
      ca: "Anàlisi en profunditat d'una acció específica (p. ex. Acció 2-1). La IA llegeix l'acció, el seu objectiu pare i el seu àmbit, i ofereix anàlisi de viabilitat i referències encreuades.",
      en: "In-depth analysis of a specific action (e.g. Action 2-1). The AI reads the action, its parent goal, and its sphere, then provides feasibility analysis and cross-references.",
      es: "Análisis en profundidad de una acción específica (p. ej. Acción 2-1). La IA lee la acción, su objetivo padre y su ámbito, y ofrece análisis de viabilidad y referencias cruzadas.",
    },
  },
];

// --- Client configs ---

export const mcpClientConfigs: McpClientConfig[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    instructions: {
      ca: "Executeu aquesta comanda al terminal:",
      en: "Run this command in your terminal:",
      es: "Ejecuta este comando en la terminal:",
    },
    code: "claude mcp add catalunya-2022 --transport http https://mcp.2022.cat",
    language: "bash",
  },
  {
    id: "claude-desktop",
    name: "Claude Web / Claude Desktop",
    instructions: {
      ca: "Aneu a Settings → Connectors → Add custom connector:",
      en: "Go to Settings → Connectors → Add custom connector:",
      es: "Ve a Settings → Connectors → Add custom connector:",
    },
    code: `Name:                catalunya-2022
URL:                 https://mcp.2022.cat
OAuth Client ID:     (leave empty)
OAuth Client Secret: (leave empty)`,
    language: "text",
    note: {
      ca: "Els servidors MCP remots s'afegeixen per la interfície de Connectors, no pel fitxer claude_desktop_config.json (que només admet servidors locals/stdio).",
      en: "Remote MCP servers must be added through the Connectors UI, not the claude_desktop_config.json file (which only supports local/stdio servers).",
      es: "Los servidores MCP remotos se añaden por la interfaz de Connectors, no por el archivo claude_desktop_config.json (que solo admite servidores locales/stdio).",
    },
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    instructions: {
      ca: "A ChatGPT, aneu a Settings → Apps, activeu Developer Mode dins Advanced, i creeu una app personalitzada:",
      en: "In ChatGPT, go to Settings → Apps, turn on Developer Mode under Advanced, then create a custom app:",
      es: "En ChatGPT, ve a Settings → Apps, activa Developer Mode dentro de Advanced y crea una app personalizada:",
    },
    code: `Name:        Catalunya 2022
Description: Access the Catalunya 2022 policy document
URL:         https://mcp.2022.cat`,
    language: "text",
    note: {
      ca: "No cal autenticació. La disponibilitat d'apps personalitzades depèn del vostre pla de ChatGPT i pot canviar; si l'opció no apareix, consulteu la documentació actual d'Apps.",
      en: "No authentication required. Custom app availability depends on your ChatGPT plan and can change; if the option is missing, check OpenAI's current Apps documentation.",
      es: "No requiere autenticación. La disponibilidad de apps personalizadas depende de tu plan de ChatGPT y puede cambiar; si no ves la opción, consulta la documentación actual de Apps de OpenAI.",
    },
  },
  {
    id: "cursor",
    name: "Cursor",
    instructions: {
      ca: "Afegiu a .cursor/mcp.json al vostre projecte (o ~/.cursor/mcp.json globalment):",
      en: "Add to .cursor/mcp.json in your project (or ~/.cursor/mcp.json globally):",
      es: "Añade a .cursor/mcp.json en tu proyecto (o ~/.cursor/mcp.json globalmente):",
    },
    code: `{
  "mcpServers": {
    "catalunya-2022": {
      "url": "https://mcp.2022.cat"
    }
  }
}`,
    language: "json",
  },
  {
    id: "vscode",
    name: "VS Code (GitHub Copilot)",
    instructions: {
      ca: "Afegiu a .vscode/mcp.json al vostre projecte:",
      en: "Add to .vscode/mcp.json in your project:",
      es: "Añade a .vscode/mcp.json en tu proyecto:",
    },
    code: `{
  "servers": {
    "catalunya-2022": {
      "type": "http",
      "url": "https://mcp.2022.cat"
    }
  }
}`,
    language: "json",
    note: {
      ca: "VS Code utilitza \"servers\" (no \"mcpServers\") i requereix el camp \"type\": \"http\".",
      en: "VS Code uses \"servers\" (not \"mcpServers\") and requires the \"type\": \"http\" field.",
      es: "VS Code utiliza \"servers\" (no \"mcpServers\") y requiere el campo \"type\": \"http\".",
    },
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    instructions: {
      ca: "Afegiu a ~/.codex/config.toml (o .codex/config.toml al vostre projecte):",
      en: "Add to ~/.codex/config.toml (or .codex/config.toml in your project):",
      es: "Añade a ~/.codex/config.toml (o .codex/config.toml en tu proyecto):",
    },
    code: `[mcp_servers.catalunya-2022]
url = "https://mcp.2022.cat"`,
    language: "toml",
    note: {
      ca: "No cal bearer_token_env_var ni http_headers. Codex utilitza format TOML, no JSON.",
      en: "No bearer_token_env_var or http_headers needed. Codex uses TOML format, not JSON.",
      es: "No se necesita bearer_token_env_var ni http_headers. Codex usa formato TOML, no JSON.",
    },
  },
  {
    id: "windsurf",
    name: "Windsurf",
    instructions: {
      ca: "Afegiu a ~/.codeium/windsurf/mcp_config.json (o a Settings → Tools → Windsurf Settings → Add Server):",
      en: "Add to ~/.codeium/windsurf/mcp_config.json (or in Settings → Tools → Windsurf Settings → Add Server):",
      es: "Añade a ~/.codeium/windsurf/mcp_config.json (o en Settings → Tools → Windsurf Settings → Add Server):",
    },
    code: `{
  "mcpServers": {
    "catalunya-2022": {
      "serverUrl": "https://mcp.2022.cat"
    }
  }
}`,
    language: "json",
    note: {
      ca: "Windsurf admet \"serverUrl\" o \"url\" per a servidors remots. Aquest exemple utilitza \"serverUrl\" perquè és el format més explícit.",
      en: "Windsurf accepts either \"serverUrl\" or \"url\" for remote servers. This example uses \"serverUrl\" because it is the most explicit form.",
      es: "Windsurf acepta \"serverUrl\" o \"url\" para servidores remotos. Este ejemplo usa \"serverUrl\" porque es la forma más explícita.",
    },
  },
  {
    id: "cline",
    name: "Cline",
    instructions: {
      ca: "Afegiu-lo des de MCP Servers → Remote Servers, o editeu cline_mcp_settings.json (MCP Servers → Configure → Configure MCP Servers):",
      en: "Add it from MCP Servers → Remote Servers, or edit cline_mcp_settings.json (MCP Servers → Configure → Configure MCP Servers):",
      es: "Añádelo desde MCP Servers → Remote Servers, o edita cline_mcp_settings.json (MCP Servers → Configure → Configure MCP Servers):",
    },
    code: `{
  "mcpServers": {
    "catalunya-2022": {
      "type": "streamableHttp",
      "url": "https://mcp.2022.cat"
    }
  }
}`,
    language: "json",
    note: {
      ca: "Indiqueu \"type\": \"streamableHttp\" explícitament: si s'omet, Cline utilitza el transport SSE antic per compatibilitat.",
      en: "Set \"type\": \"streamableHttp\" explicitly: if omitted, Cline falls back to the legacy SSE transport for backward compatibility.",
      es: "Indica \"type\": \"streamableHttp\" explícitamente: si se omite, Cline usa el transporte SSE antiguo por compatibilidad.",
    },
  },
  {
    id: "continue",
    name: "Continue",
    instructions: {
      ca: "Creeu .continue/mcpServers/catalunya-2022.yaml al vostre espai de treball:",
      en: "Create .continue/mcpServers/catalunya-2022.yaml in your workspace:",
      es: "Crea .continue/mcpServers/catalunya-2022.yaml en tu espacio de trabajo:",
    },
    code: `name: Catalunya 2022
version: 1.0.0
schema: v1
mcpServers:
  - name: Catalunya 2022
    type: streamable-http
    url: https://mcp.2022.cat`,
    language: "yaml",
    note: {
      ca: "Les eines MCP només funcionen en el mode agent de Continue.",
      en: "MCP tools only work in Continue's agent mode.",
      es: "Las herramientas MCP solo funcionan en el modo agente de Continue.",
    },
  },
  {
    id: "generic",
    name: { ca: "Qualsevol client MCP", en: "Any MCP Client", es: "Cualquier cliente MCP" },
    instructions: {
      ca: "El servidor utilitza transport Streamable HTTP a l'URL arrel. Sense autenticació, sense claus API:",
      en: "The server uses Streamable HTTP transport at the root URL. No authentication, no API keys:",
      es: "El servidor utiliza transporte Streamable HTTP en la URL raíz. Sin autenticación, sin claves API:",
    },
    code: `URL:            https://mcp.2022.cat
Transport:      Streamable HTTP
Authentication: None (public)
Headers:        (none needed)
API keys:       (none needed)`,
    language: "text",
    note: {
      ca: "Si el vostre client demana detalls d'autenticació, tokens bearer, capçaleres o claus API, deixeu-ho tot buit.",
      en: "If your client asks for authentication details, bearer tokens, headers, or API keys, leave them all empty.",
      es: "Si tu cliente pide detalles de autenticación, tokens bearer, cabeceras o claves API, déjalo todo vacío.",
    },
  },
];

// --- Example questions ---

export const mcpExampleQuestions: Trilingual<string[]> = {
  ca: [
    "Quins són els 3 àmbits i quants objectius té cadascun?",
    "Què proposa el document sobre habitatge?",
    "Resumeix l'Objectiu 6 sobre sobirania alimentària i energètica i les seves accions més rellevants",
    "Troba totes les propostes que mencionen dades o infraestructura digital a tots els àmbits",
    "Si Catalunya només pogués implementar 5 de les 91 propostes, quines 5 tindrien més impacte sistèmic? Justifica-ho amb evidència del document.",
    "Què proposa l'Acció 1-1 sobre inversió cultural i com es compara amb les mitjanes europees?",
  ],
  en: [
    "What are the 3 spheres and how many goals does each one have?",
    "What does the document propose about housing?",
    "Summarize Goal 6 on food and energy sovereignty and its most impactful actions",
    "Find all proposals that mention data or digital infrastructure across all spheres",
    "If Catalonia could only implement 5 of the 91 proposals, which 5 would create the most systemic impact? Justify with evidence from the document.",
    "What does Action 1-1 propose about cultural investment, and how does it compare to European averages?",
  ],
  es: [
    "¿Cuáles son los 3 ámbitos y cuántos objetivos tiene cada uno?",
    "¿Qué propone el documento sobre vivienda?",
    "Resume el Objetivo 6 sobre soberanía alimentaria y energética y sus acciones más relevantes",
    "Encuentra todas las propuestas que mencionan datos o infraestructura digital en todos los ámbitos",
    "Si Cataluña solo pudiera implementar 5 de las 91 propuestas, ¿cuáles 5 tendrían más impacto sistémico? Justifícalo con evidencia del documento.",
    "¿Qué propone la Acción 1-1 sobre inversión cultural y cómo se compara con las medias europeas?",
  ],
};

// --- Technical details ---

export const mcpTechnicalDetails = {
  protocol: "MCP (Model Context Protocol) over Streamable HTTP",
  endpoint: "POST https://mcp.2022.cat/",
  rateLimit: "120 requests/minute",
  authentication: {
    ca: "Cap. Accés públic",
    en: "None. Public access",
    es: "Ninguna. Acceso público",
  } satisfies Trilingual<string>,
  languages: {
    ca: "Català (ca), anglès (en), castellà (es). Per defecte: català",
    en: "Catalan (ca), English (en), Spanish (es). Default: Catalan",
    es: "Catalán (ca), inglés (en), castellano (es). Por defecto: catalán",
  } satisfies Trilingual<string>,
  content: {
    ca: "109 seccions, 30 perfils d'experts, ~0,56 MB de corpus",
    en: "109 sections, 30 contributor profiles, ~0.56 MB corpus",
    es: "109 secciones, 30 perfiles de expertos, ~0,56 MB de corpus",
  } satisfies Trilingual<string>,
};
