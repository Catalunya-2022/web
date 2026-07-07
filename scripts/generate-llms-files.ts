import fs from "fs/promises";
import path from "path";
import { routing, type Locale } from "../src/i18n/routing";
import {
  ACTION_COUNTS,
  SPHERE_GOALS,
  type GoalId,
  type SphereId,
} from "../src/lib/data/constants";
import { buildCitationText, citeLabel } from "../src/lib/citation";
import { BASE_URL, buildAbsoluteUrl } from "../src/lib/metadata";
import {
  buildCanonicalGoalPath,
  buildCanonicalSpherePath,
  localizeHref,
} from "../src/lib/path-utils";
import { uiStrings } from "../src/lib/ui-strings";

type LocaleConfig = {
  title: string;
  summary: string;
  canonicalNote: string;
  headings: {
    canonical: string;
    core: string;
    language: string;
    spheres: string;
    goals: string;
    downloads: string;
    optional: string;
  };
  labels: {
    sphere: string;
    goal: string;
    actions: string;
  };
  descriptions: {
    curated: string;
    fullContext: string;
    fullMarkdown: string;
    fullPdf: string;
    fullEpub: string;
    introduction: string;
    executiveSummary: string;
    train: string;
    actionPlan: string;
    resources: string;
    taskForce: string;
    organizations: string;
    peopleConsulted: string;
    press: string;
    catalanMirror?: string;
    catalanFull?: string;
    catalanMarkdown?: string;
    englishMirror?: string;
    englishFull?: string;
    spanishMirror?: string;
    spanishFull?: string;
    mcpServer: string;
    mcpInstructions: string;
  };
  actionPlanTitle: string;
  fullMarkdownTitle: string;
  fullPdfTitle: string;
  fullEpubTitle: string;
  localeMirrorLabel: string;
};

type HeadingInfo = {
  h1: string;
  h2: string;
};

type GoalEntry = {
  goalId: GoalId;
  title: string;
  url: string;
  actionCount: number;
};

type SphereEntry = {
  sphereId: SphereId;
  title: string;
  url: string;
  goalCount: number;
  actionCount: number;
  goals: GoalEntry[];
};

type LocaleData = {
  intro: HeadingInfo;
  executiveSummary: HeadingInfo;
  trainOfProsperity: HeadingInfo;
  spheres: SphereEntry[];
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CONTENT_DIR = path.join(process.cwd(), "content");
const LOCALES = routing.locales;

const STATIC_PAGE_SLUGS = {
  introduction: "/introduction",
  executiveSummary: "/executive-summary",
  trainOfProsperity: "/train-of-prosperity",
  actionPlan: "/action-plan",
  taskForce: "/task-force",
  organizations: "/organizations",
  peopleConsulted: "/people-consulted",
  press: "/press",
  resources: "/resources",
  mcp: "/mcp",
} as const;

const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  ca: {
    title: "Catalunya 2022 - RESET: Crida per reactivar el país",
    summary:
      "Document estratègic del Grup de Treball Catalunya 2022 per reactivar el país. 3 àmbits de transformació, 12 objectius i 91 accions concretes sobre societat, economia i sector públic.",
    canonicalNote:
      "El català és la llengua original i canònica del projecte. Les versions en anglès i castellà són miralls traduïts amb la mateixa numeració d'àmbits, objectius i accions. Si hi ha qualsevol diferència d'interpretació, citació o matís, feu servir la versió catalana.",
    headings: {
      canonical: "Documents Canònics",
      core: "Documents Principals",
      language: "Política lingüística",
      spheres: "Àmbits",
      goals: "Objectius",
      downloads: "Descàrregues",
      optional: "Opcional",
    },
    labels: {
      sphere: "Àmbit",
      goal: "Objectiu",
      actions: "accions",
    },
    descriptions: {
      curated: "Índex curt per a sistemes d'IA.",
      fullContext: "Context complet en català per a sistemes d'IA.",
      fullMarkdown: "Document complet en Markdown.",
      fullPdf: "Edició maquetada de referència.",
      fullEpub: "Edició EPUB del document complet.",
      introduction:
        "Context, mandat i metodologia del Grup de Treball Catalunya 2022.",
      executiveSummary: "Síntesi dels 3 àmbits, 12 objectius i 91 accions.",
      train:
        "Marc conceptual del document i visió de transformació del país.",
      actionPlan:
        "Índex interactiu de tots els àmbits, objectius i accions.",
      resources: "Descàrregues, documents oficials i materials complementaris.",
      taskForce:
        "Perfils dels 30 experts de la societat civil que han redactat el document.",
      organizations:
        "Més de 230 organitzacions consultades durant l'elaboració del document.",
      peopleConsulted:
        "Directori de persones consultades i context de la crida oberta.",
      press: "Cobertura de premsa i vídeo destacat sobre el projecte.",
      englishMirror:
        "Mirall curat en anglès amb la mateixa numeració que l'original català.",
      englishFull: "Context complet en anglès per a sistemes d'IA.",
      spanishMirror:
        "Mirall curat en castellà amb la mateixa numeració que l'original català.",
      spanishFull: "Context complet en castellà per a sistemes d'IA.",
      catalanMarkdown: "Document complet canònic en català.",
      mcpServer:
        "Servidor MCP per connectar assistents d'IA (Claude, ChatGPT, Cursor) al contingut de Catalunya 2022. Protocol obert, sense autenticació.",
      mcpInstructions:
        "Com connectar el teu client d'IA al servidor MCP de Catalunya 2022.",
    },
    actionPlanTitle: "Pla d'acció",
    fullMarkdownTitle: "Document complet en Markdown",
    fullPdfTitle: "Document complet en PDF",
    fullEpubTitle: "Document complet en EPUB",
    localeMirrorLabel: "llms-full.txt",
  },
  en: {
    title: "Catalunya 2022 - RESET: Call to reactivate Catalonia",
    summary:
      "Strategic plan created by the Catalunya 2022 task force to reactivate Catalonia. 3 spheres of transformation, 12 goals, and 91 concrete actions across society, economy, and the public sector.",
    canonicalNote:
      "Catalan is the original and canonical source language. The English and Spanish editions are translated mirrors with identical sphere, goal, and action numbering. If wording or interpretation diverges, use the Catalan version as the canonical basis.",
    headings: {
      canonical: "Canonical Source",
      core: "Core Documents",
      language: "Language Policy",
      spheres: "Spheres",
      goals: "Goals",
      downloads: "Downloads",
      optional: "Optional",
    },
    labels: {
      sphere: "Sphere",
      goal: "Goal",
      actions: "actions",
    },
    descriptions: {
      curated: "Curated AI index for the canonical Catalan site.",
      fullContext: "Full English context for AI systems.",
      fullMarkdown: "Full document in Markdown.",
      fullPdf: "Reference laid-out PDF edition.",
      fullEpub: "EPUB edition of the full document.",
      introduction:
        "Context, mandate, and working method of the Catalunya 2022 task force.",
      executiveSummary: "Summary of the 3 spheres, 12 goals, and 91 actions.",
      train: "Conceptual framework and transformation vision behind the plan.",
      actionPlan: "Interactive index of all spheres, goals, and actions.",
      resources: "Downloads, official records, and complementary materials.",
      taskForce:
        "Profiles of the 30 civil society experts who authored the plan.",
      organizations:
        "More than 230 organizations consulted during the drafting process.",
      peopleConsulted:
        "Directory of consulted individuals and open-call context.",
      press: "Press coverage and featured video about the project.",
      catalanMirror:
        "Catalan canonical AI index for the original source text.",
      catalanFull: "Full Catalan context for AI systems.",
      catalanMarkdown: "Canonical full document in Catalan Markdown.",
      spanishMirror:
        "Spanish curated mirror with the same numbering as the Catalan original.",
      spanishFull: "Full Spanish context for AI systems.",
      mcpServer:
        "MCP server to connect AI assistants (Claude, ChatGPT, Cursor) to the Catalunya 2022 content. Open protocol, no authentication.",
      mcpInstructions:
        "How to connect your AI client to the Catalunya 2022 MCP server.",
    },
    actionPlanTitle: "Action Plan",
    fullMarkdownTitle: "Full Document in Markdown",
    fullPdfTitle: "Full Document in PDF",
    fullEpubTitle: "Full Document in EPUB",
    localeMirrorLabel: "English llms-full.txt",
  },
  es: {
    title: "Catalunya 2022 - RESET: Llamamiento para reactivar el país",
    summary:
      "Plan estratégico del Grupo de Trabajo Catalunya 2022 para reactivar Cataluña. 3 ámbitos de transformación, 12 objetivos y 91 acciones concretas en sociedad, economía y sector público.",
    canonicalNote:
      "El catalán es la lengua original y canónica del proyecto. Las ediciones en inglés y español son espejos traducidos con la misma numeración de ámbitos, objetivos y acciones. Si hay alguna diferencia de redacción o interpretación, utiliza la versión catalana como base canónica.",
    headings: {
      canonical: "Fuente Canónica",
      core: "Documentos Principales",
      language: "Política lingüística",
      spheres: "Ámbitos",
      goals: "Objetivos",
      downloads: "Descargas",
      optional: "Opcional",
    },
    labels: {
      sphere: "Ámbito",
      goal: "Objetivo",
      actions: "acciones",
    },
    descriptions: {
      curated: "Índice curado de IA para el sitio canónico en catalán.",
      fullContext: "Contexto completo en español para sistemas de IA.",
      fullMarkdown: "Documento completo en Markdown.",
      fullPdf: "Edición maquetada de referencia.",
      fullEpub: "Edición EPUB del documento completo.",
      introduction:
        "Contexto, mandato y metodología del Grupo de Trabajo Catalunya 2022.",
      executiveSummary:
        "Resumen de los 3 ámbitos, 12 objetivos y 91 acciones.",
      train: "Marco conceptual y visión de transformación del plan.",
      actionPlan:
        "Índice interactivo de todos los ámbitos, objetivos y acciones.",
      resources: "Descargas, registros oficiales y materiales complementarios.",
      taskForce:
        "Perfiles de los 30 expertos de la sociedad civil que redactaron el documento.",
      organizations:
        "Más de 230 organizaciones consultadas durante la elaboración del documento.",
      peopleConsulted:
        "Directorio de personas consultadas y contexto de la convocatoria abierta.",
      press: "Cobertura de prensa y vídeo destacado sobre el proyecto.",
      catalanMirror:
        "Índice canónico en catalán para el texto fuente original.",
      catalanFull: "Contexto completo en catalán para sistemas de IA.",
      catalanMarkdown: "Documento completo canónico en catalán Markdown.",
      englishMirror:
        "Espejo curado en inglés con la misma numeración que el original catalán.",
      englishFull: "Contexto completo en inglés para sistemas de IA.",
      mcpServer:
        "Servidor MCP para conectar asistentes de IA (Claude, ChatGPT, Cursor) al contenido de Catalunya 2022. Protocolo abierto, sin autenticación.",
      mcpInstructions:
        "Cómo conectar tu cliente de IA al servidor MCP de Catalunya 2022.",
    },
    actionPlanTitle: "Plan de acción",
    fullMarkdownTitle: "Documento completo en Markdown",
    fullPdfTitle: "Documento completo en PDF",
    fullEpubTitle: "Documento completo en EPUB",
    localeMirrorLabel: "llms-full.txt en español",
  },
};

function makeAbsoluteUrl(relativePath: string): string {
  if (!relativePath || relativePath === "/") {
    return BASE_URL;
  }

  return `${BASE_URL}${relativePath}`;
}

function buildLocalizedPageUrl(
  locale: Locale,
  slug: (typeof STATIC_PAGE_SLUGS)[keyof typeof STATIC_PAGE_SLUGS]
): string {
  return makeAbsoluteUrl(localizeHref(slug, locale));
}

function buildLocalizedHierarchyUrl(
  locale: Locale,
  sphereId: SphereId,
  goalId?: GoalId
): string {
  const canonicalPath =
    goalId === undefined
      ? buildCanonicalSpherePath(sphereId)
      : buildCanonicalGoalPath(sphereId, goalId);

  return makeAbsoluteUrl(localizeHref(canonicalPath, locale));
}

function buildLlmsPath(locale: Locale, variant: "curated" | "full"): string {
  const fileName = variant === "curated" ? "llms.txt" : "llms-full.txt";
  return locale === "ca" ? fileName : `${locale}/${fileName}`;
}

function buildFullDocumentSource(locale: Locale): string {
  return `documents/catalunya-2022-${locale}.md`;
}

function buildDocumentDownloadUrl(
  locale: Locale,
  format: "pdf" | "epub"
): string {
  return makeAbsoluteUrl(`/documents/catalunya-2022-${locale}.${format}`);
}

function countSphereActions(goalIds: readonly GoalId[]): number {
  return goalIds.reduce((total, goalId) => total + ACTION_COUNTS[goalId], 0);
}

async function readContentHeadings(
  locale: Locale,
  relativePath: string
): Promise<HeadingInfo> {
  const filePath = path.join(CONTENT_DIR, locale, relativePath);
  const content = await fs.readFile(filePath, "utf8");
  const h1Match = content.match(/^#\s+(.+)$/m);
  const h2Match = content.match(/^##\s+(.+)$/m);

  if (!h1Match) {
    throw new Error(`Missing H1 heading in ${filePath}`);
  }

  return {
    h1: h1Match[1].trim(),
    h2: h2Match ? h2Match[1].trim() : "",
  };
}

async function collectLocaleData(locale: Locale): Promise<LocaleData> {
  const intro = await readContentHeadings(locale, "introduction.mdx");
  const executiveSummary = await readContentHeadings(
    locale,
    "executive-summary.mdx"
  );
  const trainOfProsperity = await readContentHeadings(
    locale,
    "train-of-prosperity.mdx"
  );
  const spheres: SphereEntry[] = [];

  for (const sphereId of Object.keys(SPHERE_GOALS).map(
    (value) => Number(value) as SphereId
  )) {
    const goalIds = SPHERE_GOALS[sphereId];
    const sphereHeadings = await readContentHeadings(
      locale,
      `sphere${sphereId}/sphere${sphereId}.mdx`
    );
    const goals: GoalEntry[] = [];

    for (const goalId of goalIds) {
      const goalHeadings = await readContentHeadings(
        locale,
        `sphere${sphereId}/goal${goalId}/goal${goalId}.mdx`
      );

      goals.push({
        goalId,
        title: goalHeadings.h2,
        url: buildLocalizedHierarchyUrl(locale, sphereId, goalId),
        actionCount: ACTION_COUNTS[goalId],
      });
    }

    spheres.push({
      sphereId,
      title: sphereHeadings.h2,
      url: buildLocalizedHierarchyUrl(locale, sphereId),
      goalCount: goalIds.length,
      actionCount: countSphereActions(goalIds),
      goals,
    });
  }

  return {
    intro,
    executiveSummary,
    trainOfProsperity,
    spheres,
  };
}

function buildCoreDocumentsSection(locale: Locale, localeData: LocaleData): string {
  const config = LOCALE_CONFIG[locale];
  const ui = uiStrings[locale];

  return [
    `## ${config.headings.core}`,
    "",
    `- [${config.localeMirrorLabel}](${makeAbsoluteUrl(`/${buildLlmsPath(locale, "full")}`.replace(/\/+/g, "/"))}): ${config.descriptions.fullContext}`,
    `- [${localeData.intro.h1}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.introduction)}): ${config.descriptions.introduction}`,
    `- [${localeData.executiveSummary.h1}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.executiveSummary)}): ${config.descriptions.executiveSummary}`,
    `- [${localeData.trainOfProsperity.h1}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.trainOfProsperity)}): ${config.descriptions.train}`,
    `- [${config.actionPlanTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.actionPlan)}): ${config.descriptions.actionPlan}`,
    `- [${ui.resourcesTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.resources)}): ${config.descriptions.resources}`,
    "",
  ].join("\n");
}

function buildSpheresSection(locale: Locale, localeData: LocaleData): string {
  const config = LOCALE_CONFIG[locale];
  const lines = [`## ${config.headings.spheres}`, ""];

  for (const sphere of localeData.spheres) {
    lines.push(
      `- [${config.labels.sphere} ${sphere.sphereId}](${sphere.url}): ${sphere.title} - ${sphere.goalCount} ${config.headings.goals.toLowerCase()} / ${sphere.actionCount} ${config.labels.actions}`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function buildGoalsSection(locale: Locale, localeData: LocaleData): string {
  const config = LOCALE_CONFIG[locale];
  const lines = [`## ${config.headings.goals}`, ""];

  for (const sphere of localeData.spheres) {
    lines.push(`### ${config.labels.sphere} ${sphere.sphereId} - ${sphere.title}`, "");

    for (const goal of sphere.goals) {
      lines.push(
        `- [${config.labels.goal} ${goal.goalId}](${goal.url}): ${goal.title} - ${goal.actionCount} ${config.labels.actions}`
      );
    }

    lines.push("");
  }

  return lines.join("\n");
}

function buildDownloadsSection(locale: Locale): string {
  const config = LOCALE_CONFIG[locale];

  return [
    `## ${config.headings.downloads}`,
    "",
    `- [${config.fullMarkdownTitle}](${makeAbsoluteUrl(`/${buildFullDocumentSource(locale)}`.replace(/\/+/g, "/"))}): ${config.descriptions.fullMarkdown}`,
    `- [${config.fullPdfTitle}](${buildDocumentDownloadUrl(locale, "pdf")}): ${config.descriptions.fullPdf}`,
    `- [${config.fullEpubTitle}](${buildDocumentDownloadUrl(locale, "epub")}): ${config.descriptions.fullEpub}`,
    "",
  ].join("\n");
}

function buildOptionalSection(locale: Locale): string {
  const config = LOCALE_CONFIG[locale];
  const ui = uiStrings[locale];
  const lines = [`## ${config.headings.optional}`, ""];

  lines.push(
    `- [${ui.taskForceTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.taskForce)}): ${config.descriptions.taskForce}`,
    `- [${ui.organizationsTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.organizations)}): ${config.descriptions.organizations}`,
    `- [${ui.peopleConsultedTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.peopleConsulted)}): ${config.descriptions.peopleConsulted}`,
    `- [${ui.pressTitle}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.press)}): ${config.descriptions.press}`,
    `- [${ui.mcpPageTitle}](https://mcp.2022.cat): ${config.descriptions.mcpServer}`,
    `- [${locale === "en" ? "MCP Instructions" : locale === "es" ? "Instrucciones MCP" : "Instruccions MCP"}](${buildLocalizedPageUrl(locale, STATIC_PAGE_SLUGS.mcp)}): ${config.descriptions.mcpInstructions}`
  );

  if (locale === "ca") {
    lines.push(
      `- [English llms.txt](${makeAbsoluteUrl("/en/llms.txt")}): ${config.descriptions.englishMirror}`,
      `- [English llms-full.txt](${makeAbsoluteUrl("/en/llms-full.txt")}): ${config.descriptions.englishFull}`,
      `- [Spanish llms.txt](${makeAbsoluteUrl("/es/llms.txt")}): ${config.descriptions.spanishMirror}`,
      `- [Spanish llms-full.txt](${makeAbsoluteUrl("/es/llms-full.txt")}): ${config.descriptions.spanishFull}`
    );
  } else if (locale === "en") {
    lines.push(
      `- [Catalan llms.txt](${makeAbsoluteUrl("/llms.txt")}): ${config.descriptions.catalanMirror}`,
      `- [Catalan llms-full.txt](${makeAbsoluteUrl("/llms-full.txt")}): ${config.descriptions.catalanFull}`,
      `- [Spanish llms.txt](${makeAbsoluteUrl("/es/llms.txt")}): ${config.descriptions.spanishMirror}`,
      `- [Spanish llms-full.txt](${makeAbsoluteUrl("/es/llms-full.txt")}): ${config.descriptions.spanishFull}`
    );
  } else {
    lines.push(
      `- [Catalan llms.txt](${makeAbsoluteUrl("/llms.txt")}): ${config.descriptions.catalanMirror}`,
      `- [Catalan llms-full.txt](${makeAbsoluteUrl("/llms-full.txt")}): ${config.descriptions.catalanFull}`,
      `- [English llms.txt](${makeAbsoluteUrl("/en/llms.txt")}): ${config.descriptions.englishMirror}`,
      `- [English llms-full.txt](${makeAbsoluteUrl("/en/llms-full.txt")}): ${config.descriptions.englishFull}`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function buildCanonicalSection(locale: Locale): string {
  const config = LOCALE_CONFIG[locale];
  const lines = [`## ${config.headings.canonical}`, ""];

  if (locale === "ca") {
    lines.push(
      `- [llms.txt](${makeAbsoluteUrl("/llms.txt")}): ${config.descriptions.curated}`,
      `- [llms-full.txt](${makeAbsoluteUrl("/llms-full.txt")}): ${config.descriptions.fullContext}`,
      `- [Document complet en Markdown](${makeAbsoluteUrl("/documents/catalunya-2022-ca.md")}): ${config.descriptions.fullMarkdown}`,
      `- [Document complet en PDF](${makeAbsoluteUrl("/documents/catalunya-2022-ca.pdf")}): ${config.descriptions.fullPdf}`,
      `- [Document complet en EPUB](${makeAbsoluteUrl("/documents/catalunya-2022-ca.epub")}): ${config.descriptions.fullEpub}`
    );
  } else {
    lines.push(
      `- [Catalan llms.txt](${makeAbsoluteUrl("/llms.txt")}): ${config.descriptions.catalanMirror}`,
      `- [Catalan llms-full.txt](${makeAbsoluteUrl("/llms-full.txt")}): ${config.descriptions.catalanFull}`,
      `- [Catalan full document in Markdown](${makeAbsoluteUrl("/documents/catalunya-2022-ca.md")}): ${config.descriptions.catalanMarkdown}`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function buildCuratedIndex(locale: Locale, localeData: LocaleData): string {
  const config = LOCALE_CONFIG[locale];
  const lines = [
    `# ${config.title}`,
    "",
    `> ${config.summary}`,
    "",
    `${citeLabel[locale]}:`,
    buildCitationText(buildAbsoluteUrl("/", locale), locale),
    "",
    buildCanonicalSection(locale).trimEnd(),
    "",
    `## ${config.headings.language}`,
    "",
    config.canonicalNote,
    "",
    buildCoreDocumentsSection(locale, localeData).trimEnd(),
    "",
    buildSpheresSection(locale, localeData).trimEnd(),
    "",
    buildGoalsSection(locale, localeData).trimEnd(),
    "",
    buildDownloadsSection(locale).trimEnd(),
    "",
    buildOptionalSection(locale).trimEnd(),
    "",
  ];

  return `${lines.join("\n")}`.trimEnd() + "\n";
}

async function copyFullContext(locale: Locale): Promise<void> {
  const sourceFile = path.join(PUBLIC_DIR, buildFullDocumentSource(locale));
  const targetFile = path.join(PUBLIC_DIR, buildLlmsPath(locale, "full"));

  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.copyFile(sourceFile, targetFile);
}

async function writeCuratedIndex(
  locale: Locale,
  localeData: LocaleData
): Promise<void> {
  const targetFile = path.join(PUBLIC_DIR, buildLlmsPath(locale, "curated"));

  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, buildCuratedIndex(locale, localeData), "utf8");
}

async function main(): Promise<void> {
  for (const locale of LOCALES) {
    const localeData = await collectLocaleData(locale);
    await writeCuratedIndex(locale, localeData);
    await copyFullContext(locale);
  }

  for (const locale of LOCALES) {
    const curatedPath = path.join(PUBLIC_DIR, buildLlmsPath(locale, "curated"));
    const fullPath = path.join(PUBLIC_DIR, buildLlmsPath(locale, "full"));
    const curatedSize = (await fs.stat(curatedPath)).size;
    const fullSize = (await fs.stat(fullPath)).size;
    console.log(`${buildLlmsPath(locale, "curated")}: ${curatedSize} bytes`);
    console.log(`${buildLlmsPath(locale, "full")}: ${fullSize} bytes`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
