import type { Trilingual } from "@/i18n/routing";

export type ResourceIconName = "file-down" | "book-open" | "presentation" | "scale" | "github" | "server" | "bar-chart-3" | "message-circle" | "archive";

type ResourceDownload = {
  lang: string;
  href: string;
};

type ResourceExternalLink = {
  lang: string;
  href: string;
  label: string;
};

type RepoBadge = {
  readonly label: string;
  readonly href: string;
};

export type ResourceItem = {
  title: Trilingual;
  description: Trilingual | string;
  icon: ResourceIconName;
  downloads?: ResourceDownload[];
  externalLinks?: ResourceExternalLink[];
  /** Single external URL for link-only cards (GitHub, MCP, etc.) */
  href?: string;
  /** Render the link card with the same compact type scale as download cards,
   *  for link cards that sit in a grid next to them. Description line breaks
   *  (\n) are preserved. */
  compact?: boolean;
  disabled?: boolean;
  disabledReason?: Trilingual;
  repoBadges?: RepoBadge[];
};

export type ResourceSection = {
  label: Trilingual;
  title: Trilingual;
  description: Trilingual;
  items: ResourceItem[];
};

export const resourceSections: ResourceSection[] = [
  {
    label: { ca: "Contingut Principal", en: "Core Content", es: "Contenido Principal" },
    title: { ca: "Documents i Publicacions", en: "Documents & Publications", es: "Documentos y Publicaciones" },
    description: {
      ca: "El document complet de Catalunya 2022 i el resum executiu, disponibles en diversos formats i idiomes.",
      en: "The complete Catalunya 2022 document and executive summary, available in multiple formats and languages.",
      es: "El documento completo de Catalunya 2022 y el resumen ejecutivo, disponibles en diversos formatos e idiomas.",
    },
    items: [
      {
        title: { ca: "Document Complet", en: "Full Document", es: "Documento Completo" },
        description: "PDF",
        icon: "file-down",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-ca.pdf" },
          { lang: "Español", href: "/documents/catalunya-2022-es.pdf" },
          { lang: "English", href: "/documents/catalunya-2022-en.pdf" },
        ],
      },
      {
        title: { ca: "Resum Executiu", en: "Executive Summary", es: "Resumen Ejecutivo" },
        description: "PDF",
        icon: "file-down",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-executive-summary-ca.pdf" },
          { lang: "Español", href: "/documents/catalunya-2022-executive-summary-es.pdf" },
          { lang: "English", href: "/documents/catalunya-2022-executive-summary-en.pdf" },
        ],
      },
      {
        title: { ca: "Document Complet", en: "Full Document", es: "Documento Completo" },
        description: "EPUB",
        icon: "book-open",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-ca.epub" },
          { lang: "Español", href: "/documents/catalunya-2022-es.epub" },
          { lang: "English", href: "/documents/catalunya-2022-en.epub" },
        ],
      },
      {
        title: { ca: "Document Complet", en: "Full Document", es: "Documento Completo" },
        description: "Markdown",
        icon: "file-down",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-ca.md" },
          { lang: "Español", href: "/documents/catalunya-2022-es.md" },
          { lang: "English", href: "/documents/catalunya-2022-en.md" },
        ],
      },
      {
        title: { ca: "Arxiu Permanent", en: "Permanent Archive", es: "Archivo Permanente" },
        description: {
          ca: "Dipòsit arxivat a Zenodo (CERN)\nDOI 10.5281/zenodo.19500831",
          en: "Archived deposit on Zenodo (CERN)\nDOI 10.5281/zenodo.19500831",
          es: "Depósito archivado en Zenodo (CERN)\nDOI 10.5281/zenodo.19500831",
        },
        icon: "archive",
        href: "https://doi.org/10.5281/zenodo.19500831",
        compact: true,
      },
    ],
  },
  {
    label: { ca: "Presentacions", en: "Slide Decks", es: "Presentaciones" },
    title: { ca: "Presentacions", en: "Presentations", es: "Presentaciones" },
    description: {
      ca: "Presentacions visuals que resumeixen les conclusions i el pla d'acció de Catalunya 2022.",
      en: "Visual presentations summarizing the Catalunya 2022 findings and action plan.",
      es: "Presentaciones visuales que resumen las conclusiones y el plan de acción de Catalunya 2022.",
    },
    items: [
      {
        title: { ca: "Presentació Completa", en: "Full Presentation", es: "Presentación Completa" },
        description: { ca: "PDF · Només en català", en: "PDF · Catalan only", es: "PDF · Solo en catalán" },
        icon: "presentation",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-presentation-full.pdf" },
        ],
      },
      {
        title: { ca: "Presentació Breu", en: "Short Presentation", es: "Presentación Breve" },
        description: { ca: "PDF · Només en català", en: "PDF · Catalan only", es: "PDF · Solo en catalán" },
        icon: "presentation",
        downloads: [
          { lang: "Català", href: "/documents/catalunya-2022-presentation-short.pdf" },
        ],
      },
    ],
  },
  {
    label: { ca: "Govern de Catalunya", en: "Government of Catalonia", es: "Gobierno de Cataluña" },
    title: { ca: "Registres Oficials", en: "Official Records", es: "Registros Oficiales" },
    description: {
      ca: "Documents oficials del Govern relacionats amb la creació i el mandat del Grup de Treball Catalunya 2022.",
      en: "Official government documents related to the creation and mandate of the Catalunya 2022 task force.",
      es: "Documentos oficiales del Gobierno relacionados con la creación y el mandato del Grupo de Trabajo Catalunya 2022.",
    },
    items: [
      {
        title: { ca: "Acord de Govern", en: "Acord de Govern", es: "Acord de Govern" },
        description: { ca: "Creació del grup de treball", en: "Creation of the task force", es: "Creación del grupo de trabajo" },
        icon: "scale",
        downloads: [
          { lang: "Català", href: "/documents/acord-de-govern-ca.pdf" },
          { lang: "Español", href: "/documents/acord-de-govern-es.pdf" },
        ],
        externalLinks: [
          {
            lang: "Català",
            href: "https://dogc.gencat.cat/ca/document-del-dogc/index.html?documentId=874219",
            label: "DOGC",
          },
          {
            lang: "Español",
            href: "https://dogc.gencat.cat/es/document-del-dogc/index.html?documentId=874219",
            label: "DOGC",
          },
        ],
      },
      {
        title: { ca: "Resolució", en: "Resolució", es: "Resolució" },
        description: { ca: "Nomenament dels membres del grup de treball", en: "Appointment of task force members", es: "Nombramiento de los miembros del grupo de trabajo" },
        icon: "scale",
        downloads: [
          { lang: "Català", href: "/documents/resolucio-ca.pdf" },
          { lang: "Español", href: "/documents/resolucio-es.pdf" },
        ],
        externalLinks: [
          {
            lang: "Català",
            href: "https://dogc.gencat.cat/ca/document-del-dogc/index.html?documentId=874214",
            label: "DOGC",
          },
          {
            lang: "Español",
            href: "https://dogc.gencat.cat/es/document-del-dogc/index.html?documentId=874214",
            label: "DOGC",
          },
        ],
      },
    ],
  },
  {
    label: { ca: "Transparència", en: "Transparency", es: "Transparencia" },
    title: { ca: "Codi Obert i Dades", en: "Open Source & Data", es: "Código Abierto y Datos" },
    description: {
      ca: "Aquest projecte està construït en obert. Tot el codi és de codi obert i les analítiques del web són públicament accessibles.",
      en: "This project is built in the open. All code is open source and the website analytics are publicly accessible.",
      es: "Este proyecto está construido en abierto. Todo el código es de código abierto y las analíticas del sitio web son públicamente accesibles.",
    },
    items: [
      {
        title: { ca: "GitHub", en: "GitHub", es: "GitHub" },
        description: {
          ca: "Codi font d'aquesta pàgina web i del Servidor MCP disponible a GitHub",
          en: "Source code for this website and the MCP Server available on GitHub",
          es: "Código fuente de esta página web y del Servidor MCP disponible en GitHub",
        },
        icon: "github",
        repoBadges: [
          { label: "Catalunya 2022", href: "https://github.com/catalunya-2022" },
          { label: "Website", href: "https://github.com/catalunya-2022/web" },
          { label: "MCP Server", href: "https://github.com/catalunya-2022/mcp" },
        ],
      },
      {
        title: { ca: "Analítiques", en: "Analytics", es: "Analíticas" },
        description: {
          ca: "Estadístiques d'aquest web en temps real amb Plausible, analítiques sense cookies que respecten la privadesa dels visitants",
          en: "Real-time stats for this website with Plausible, cookie-free analytics that respect visitor privacy",
          es: "Estadísticas de este sitio web en tiempo real con Plausible, analíticas sin cookies que respetan la privacidad de los visitantes",
        },
        icon: "bar-chart-3",
        href: "https://plausible.io/2022.cat",
      },
    ],
  },
  {
    label: { ca: "Intel·ligència Artificial", en: "Artificial Intelligence", es: "Inteligencia Artificial" },
    title: { ca: "Explora el Document", en: "Explore the Document", es: "Explora el Documento" },
    description: {
      ca: "Utilitza intel·ligència artificial per explorar, resumir i analitzar les 91 propostes del document Catalunya 2022.",
      en: "Use artificial intelligence to explore, summarize, and analyze the 91 proposals in the Catalunya 2022 document.",
      es: "Utiliza inteligencia artificial para explorar, resumir y analizar las 91 propuestas del documento Catalunya 2022.",
    },
    items: [
      {
        title: { ca: "Servidor MCP", en: "MCP Server", es: "Servidor MCP" },
        description: {
          ca: "Connecta qualsevol assistent d'IA compatible amb MCP al document Catalunya 2022",
          en: "Connect any MCP-compatible AI assistant to the Catalunya 2022 document",
          es: "Conecta cualquier asistente de IA compatible con MCP al documento Catalunya 2022",
        },
        icon: "server",
        href: "/mcp",
      },
      {
        title: { ca: "Custom GPT", en: "Custom GPT", es: "Custom GPT" },
        description: {
          ca: "Xateja directament a ChatGPT amb un assistent personalitzat que coneix tot el document",
          en: "Chat directly in ChatGPT with a custom assistant that knows the entire document",
          es: "Chatea directamente en ChatGPT con un asistente personalizado que conoce todo el documento",
        },
        icon: "message-circle",
        href: "https://chatgpt.com/g/g-69b11fba75588191b031e6311036a470-catalunya-2022",
      },
    ],
  },
];
