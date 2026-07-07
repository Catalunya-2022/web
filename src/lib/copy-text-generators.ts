import { buildAbsoluteUrl } from "@/lib/metadata";
import { formatUiString, uiStrings } from "@/lib/ui-strings";
import { buildCitationText, citeLabel } from "@/lib/citation";
import { truncateToEncodedLength, LLM_URL_QUERY_BUDGET } from "@/lib/url-utils";
import { localized } from "@/i18n/routing";
import type { Locale, Trilingual } from "@/i18n/routing";
import type { TeamMember } from "@/lib/data/team-members";
import type { Organization } from "@/lib/data/organizations";
import type { Person } from "@/lib/data/people-consulted";
import type { PressSection } from "@/lib/data/press-coverage";
import type { ResourceSection } from "@/lib/data/resources";
import type { McpTool, McpResource, McpPrompt } from "@/lib/data/mcp";
import { mcpFieldLabels, mcpSectionHeadings } from "@/lib/data/mcp";

// Keep copy-helper previews short enough for external LLM query URLs.
const MAX_LLM_SAMPLE_SIZE = 15;

/** Everything the copy-page UI needs, derived once from the page data. */
export type CopyPagePayload = {
  url: string;
  markdownText: string;
  citationText: string;
  chatgptHref: string;
  claudeHref: string;
};

export function buildCopyPagePayload(params: {
  title: string;
  slug: string;
  rawContent: string;
  locale: Locale;
  citable: boolean;
}): CopyPagePayload {
  const { title, slug, rawContent, locale, citable } = params;
  const t = uiStrings[locale];
  const url = buildAbsoluteUrl(slug, locale);
  const citationText = buildCitationText(url, locale);
  const citationTrailer = citable
    ? `\n\n---\n\n${localized(citeLabel, locale)}:\n${citationText}`
    : "";
  const markdownText = `${t.copySource} - ${title}\nURL: ${url}\n\n${rawContent}${citationTrailer}`;

  // Pre-compute LLM URLs as hrefs so consumers can use <a> tags (never blocked
  // by popup blockers). truncateToEncodedLength ensures the encoded query fits
  // within budget without producing malformed %XX sequences (which
  // slice-after-encode can cause for multibyte text).
  const llmText = `${t.copyLlmPrompt}:\n\n${markdownText}`;
  const safeText = truncateToEncodedLength(llmText, LLM_URL_QUERY_BUDGET);
  const chatgpt = new URL("https://chatgpt.com/");
  chatgpt.searchParams.set("q", safeText);
  const claude = new URL("https://claude.ai/new");
  claude.searchParams.set("q", safeText);

  return {
    url,
    markdownText,
    citationText,
    chatgptHref: chatgpt.toString(),
    claudeHref: claude.toString(),
  };
}

type SphereData = {
  num: number;
  title: string;
  goals: { goalNum: number; title: string; actionCount: number }[];
};

export function generateActionPlanText(
  spheres: SphereData[],
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const lines: string[] = [
    `# ${t.actionPlanTitle}`,
    "",
    t.actionPlanDescription,
    "",
  ];

  for (const sphere of spheres) {
    lines.push(`## ${t.sphere} ${sphere.num}: ${sphere.title}`, "");
    for (const goal of sphere.goals) {
      lines.push(`- ${t.goal} ${goal.goalNum}: ${goal.title} (${goal.actionCount} ${t.actions.toLowerCase()})`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function generateTaskForceText(
  members: TeamMember[],
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const lines: string[] = [
    `# ${t.taskForceTitle}`,
    "",
    t.taskForceDescription,
    "",
  ];

  for (const member of members) {
    const url = buildAbsoluteUrl(`/task-force/${member.slug}`, locale);
    lines.push(`- ${member.name} — ${member.role[locale]} — ${url}`);
  }

  return lines.join("\n").trim();
}

export function generatePeopleConsultedText(
  people: Person[],
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const sample = people.slice(0, MAX_LLM_SAMPLE_SIZE);
  const url = buildAbsoluteUrl("/people-consulted", locale);

  const desc = `${t.peopleConsultedDescription} ${t.peopleConsultedOpenCall} ${t.peopleConsultedOpenCallContext}`;

  const lines: string[] = [
    `# ${t.peopleConsultedTitle}`,
    "",
    desc,
    "",
    formatUiString(t.peopleConsultedCopySampleLabel, {
      total: people.length,
      sample: sample.length,
    }),
    "",
  ];

  for (const person of sample) {
    lines.push(`- ${person.firstName} ${person.lastName}`);
  }

  lines.push("", formatUiString(t.copyFullListLabel, { url }));

  return lines.join("\n").trim();
}

export function generateOrganizationsText(
  orgs: Organization[],
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const sample = orgs.slice(0, MAX_LLM_SAMPLE_SIZE);
  const url = buildAbsoluteUrl("/organizations", locale);

  const lines: string[] = [
    `# ${t.organizationsTitle}`,
    "",
    t.organizationsDescription,
    "",
    formatUiString(t.organizationsCopySampleLabel, {
      total: orgs.length,
      sample: sample.length,
    }),
    "",
  ];

  for (const org of sample) {
    lines.push(`- ${org.name[locale]}`);
  }

  lines.push("", formatUiString(t.copyFullListLabel, { url }));

  return lines.join("\n").trim();
}

export function generatePressText(
  sections: PressSection[],
  video: { title: Trilingual; url: string },
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const lines: string[] = [
    `# ${t.pressTitle}`,
    "",
    t.pressDescription,
    "",
    `${t.featuredVideo}: ${video.title[locale]} — ${video.url}`,
    "",
  ];

  for (const section of sections) {
    lines.push(`## ${section.title[locale]}`, "");
    for (const article of section.articles) {
      lines.push(`- ${article.date} | ${article.outlet} | ${article.title} | ${article.url}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function generateResourcesText(
  sections: ResourceSection[],
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const lines: string[] = [
    `# ${t.resourcesTitle}`,
    "",
    t.resourcesDescription,
    "",
  ];

  for (const section of sections) {
    lines.push(`## ${section.title[locale]}`, "");
    for (const item of section.items) {
      const title = item.title[locale];
      const desc = localized(item.description, locale);
      if (item.disabled) {
        const reason = item.disabledReason ? item.disabledReason[locale] : "";
        lines.push(`- ${title}: ${desc} (${reason})`);
      } else {
        lines.push(`- ${title}: ${desc}`);
      }
      if (item.repoBadges) {
        const repos = item.repoBadges.map((b) => `${b.label} (${b.href})`).join(", ");
        lines.push(`  ${repos}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

type McpPageData = {
  intro: string;
  serverDescription: string;
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
  clients: Array<{
    name: string | Trilingual<string>;
    instructions: Trilingual<string>;
    code: string;
    language: string;
    note?: Trilingual<string>;
  }>;
  exampleQuestions: string[];
  technical: {
    protocol: string;
    endpoint: string;
    rateLimit: string;
    authentication: Trilingual<string>;
    languages: Trilingual<string>;
    content: Trilingual<string>;
  };
};

export function generateMcpPageText(
  data: McpPageData,
  locale: Locale,
): string {
  const t = uiStrings[locale];
  const h = mcpSectionHeadings;
  const labels = mcpFieldLabels;
  const lines: string[] = [
    `# ${t.mcpTitle}`,
    "",
    t.mcpDescription,
    "",
    `## ${h.intro[locale]}`,
    "",
    data.intro,
    "",
    "Reference: https://modelcontextprotocol.io",
    "",
    `## ${h.server[locale]}`,
    "",
    data.serverDescription,
    "",
    "`https://mcp.2022.cat`",
    "",
    `## ${h.examples[locale]}`,
    "",
  ];

  for (const question of data.exampleQuestions) {
    lines.push(`- ${question}`);
  }

  lines.push("", `## ${h.connect[locale]}`, "");

  for (const client of data.clients) {
    const clientName = typeof client.name === "string" ? client.name : client.name[locale];
    lines.push(`### ${clientName}`, "", client.instructions[locale], "");
    lines.push(`\`\`\`${client.language}`);
    lines.push(client.code);
    lines.push("```");
    if (client.note) {
      lines.push("", client.note[locale]);
    }
    lines.push("");
  }

  lines.push(`## ${h.tools[locale]}`, "");

  for (const tool of data.tools) {
    lines.push(`- \`${tool.name}\`: ${tool.description[locale]}`);
  }
  lines.push("", `## ${h.resources[locale]}`, "");

  for (const resource of data.resources) {
    lines.push(`- \`${resource.uri}\`: ${resource.description[locale]}`);
  }
  lines.push("", `## ${h.prompts[locale]}`, "");

  for (const prompt of data.prompts) {
    lines.push(`- \`${prompt.name}\`: ${prompt.description[locale]}`);
  }
  lines.push("", `## ${h.technical[locale]}`, "");

  lines.push(`- ${labels.protocol[locale]}: ${data.technical.protocol}`);
  lines.push(`- ${labels.endpoint[locale]}: ${data.technical.endpoint}`);
  lines.push(`- ${labels.rateLimit[locale]}: ${data.technical.rateLimit}`);
  lines.push(`- ${labels.authentication[locale]}: ${data.technical.authentication[locale]}`);
  lines.push(`- ${labels.languages[locale]}: ${data.technical.languages[locale]}`);
  lines.push(`- ${labels.content[locale]}: ${data.technical.content[locale]}`);

  return lines.join("\n").trim();
}
