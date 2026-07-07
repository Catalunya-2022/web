import type { Metadata } from "next";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { McpClientSetup } from "@/components/content/mcp-client-setup";
import { CopyButton } from "@/components/content/copy-button";
import { supplementaryMetadata } from "@/lib/metadata";
import { JsonLd, softwareApplicationSchema } from "@/lib/structured-data";
import { uiStrings } from "@/lib/ui-strings";
import {
  resolveRouteLocale,
  setResolvedRequestLocale,
} from "@/lib/route-locale";
import { generateMcpPageText } from "@/lib/copy-text-generators";
import {
  mcpFieldLabels,
  mcpSectionLabels,
  mcpSectionHeadings,
  mcpIntroText,
  mcpIntroLearnMore,
  mcpServerDescription,
  mcpTools,
  mcpResources,
  mcpPrompts,
  mcpClientConfigs,
  mcpExampleQuestions,
  mcpTechnicalDetails,
} from "@/lib/data/mcp";
import { ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/content/section-header";

type Props = { params: Promise<{ locale: string }> };

type CapabilityItem = {
  value: string;
  description: string;
};

function CapabilitySection({
  title,
  valueLabel,
  descriptionLabel,
  items,
}: {
  title: string;
  valueLabel: string;
  descriptionLabel: string;
  items: CapabilityItem[];
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
        {title}
      </h3>

      <div className="grid gap-3 md:hidden">
        {items.map((item) => (
          <article key={item.value} className="rounded-xl border bg-card/60 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {valueLabel}
            </p>
            <code className="block break-all rounded bg-muted px-2.5 py-2 text-xs leading-relaxed">
              {item.value}
            </code>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-medium">{valueLabel}</th>
              <th className="pb-2 font-medium">{descriptionLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.value}>
                <td className="py-3 pr-4 align-top font-mono text-xs">
                  {item.value}
                </td>
                <td className="py-3 text-muted-foreground">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/mcp", l);
}

export default async function McpPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];
  const h = mcpSectionHeadings;
  const sub = mcpSectionLabels;
  const labels = mcpFieldLabels;

  return (
    <SupplementaryPageShell
      slug="/mcp"
      locale={l}
      subtitle={t.mcpSubtitle}
      title={t.mcpTitle}
      description={t.mcpDescription}
      rawContent={generateMcpPageText(
        {
          intro: mcpIntroText[l],
          serverDescription: mcpServerDescription[l],
          tools: mcpTools,
          resources: mcpResources,
          prompts: mcpPrompts,
          clients: mcpClientConfigs,
          exampleQuestions: mcpExampleQuestions[l],
          technical: mcpTechnicalDetails,
        },
        l,
      )}
    >
      <JsonLd data={softwareApplicationSchema({
        name: t.mcpTitle,
        description: t.mcpDescription,
        url: "https://mcp.2022.cat",
        locale: l,
      })} />
      <section className="mb-16">
        <SectionHeader subtitle={sub.intro[l]} title={h.intro[l]} />
        <p className="mb-3 text-[15px] leading-relaxed text-foreground/80">
          {mcpIntroText[l]}
        </p>
        <p className="text-[15px] leading-relaxed text-foreground/80">
          {mcpIntroLearnMore[l]}{" "}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-baseline gap-0.5 text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
          >
            modelcontextprotocol.io
            <ExternalLink className="relative top-[1px] size-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
          </a>
        </p>
      </section>

      <section className="mb-16">
        <SectionHeader subtitle={sub.server[l]} title={h.server[l]} />
        <p className="mb-4 text-[15px] leading-relaxed text-foreground/80">
          {mcpServerDescription[l]}
        </p>

        <div className="relative mx-auto my-8 w-fit rounded-lg border p-5 pr-12 transition-colors hover:border-primary/30 hover:bg-accent">
          <code className="text-sm font-medium">https://mcp.2022.cat</code>
          <CopyButton text="https://mcp.2022.cat" label={t.mcpCopyCommand} fullArea />
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader subtitle={sub.examples[l]} title={h.examples[l]}>
          <p className="mt-2 text-sm text-muted-foreground">{t.mcpTryAsking}</p>
        </SectionHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {mcpExampleQuestions[l].map((question) => (
            <div
              key={question}
              className="relative rounded-lg border p-5 pr-12 transition-colors hover:border-primary/30 hover:bg-accent"
            >
              <p className="text-sm text-foreground/80">
                &ldquo;{question}&rdquo;
              </p>
              <CopyButton text={question} label={t.mcpCopyQuestion} fullArea />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader subtitle={sub.connect[l]} title={h.connect[l]} />
        <McpClientSetup
          configs={mcpClientConfigs}
          locale={l}
          labels={{ copyCommand: t.mcpCopyCommand }}
        />
      </section>

      <section className="mb-16">
        <SectionHeader subtitle={sub.capabilities[l]} title={h.capabilities[l]} />
        <CapabilitySection
          title={h.tools[l]}
          valueLabel={labels.tool[l]}
          descriptionLabel={labels.description[l]}
          items={mcpTools.map((tool) => ({
            value: tool.name,
            description: tool.description[l],
          }))}
        />
        <CapabilitySection
          title={h.resources[l]}
          valueLabel={labels.uri[l]}
          descriptionLabel={labels.description[l]}
          items={mcpResources.map((resource) => ({
            value: resource.uri,
            description: resource.description[l],
          }))}
        />
        <CapabilitySection
          title={h.prompts[l]}
          valueLabel={labels.prompt[l]}
          descriptionLabel={labels.description[l]}
          items={mcpPrompts.map((prompt) => ({
            value: prompt.name,
            description: prompt.description[l],
          }))}
        />
      </section>

      <section className="mb-4">
        <SectionHeader subtitle={sub.technical[l]} title={h.technical[l]} />

        {(() => {
          const rows = [
            { label: labels.protocol[l], value: mcpTechnicalDetails.protocol },
            { label: labels.endpoint[l], value: mcpTechnicalDetails.endpoint, mono: true },
            { label: labels.rateLimit[l], value: mcpTechnicalDetails.rateLimit },
            { label: labels.authentication[l], value: mcpTechnicalDetails.authentication[l] },
            { label: labels.languages[l], value: mcpTechnicalDetails.languages[l] },
            { label: labels.content[l], value: mcpTechnicalDetails.content[l] },
          ];
          return (
            <>
              <div className="grid gap-3 md:hidden">
                {rows.map((row) => (
                  <article key={row.label} className="rounded-xl border bg-card/60 p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      {row.label}
                    </p>
                    <p className={`text-sm leading-relaxed text-foreground/80 ${row.mono ? "break-all font-mono text-xs" : ""}`}>
                      {row.value}
                    </p>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <tbody className="divide-y">
                    {rows.map((row) => (
                      <tr key={row.label}>
                        <td className="py-3 pr-4 align-top font-medium">
                          {row.label}
                        </td>
                        <td className={`py-3 text-muted-foreground ${row.mono ? "break-all font-mono text-xs" : ""}`}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
      </section>
    </SupplementaryPageShell>
  );
}
