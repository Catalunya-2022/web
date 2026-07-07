import type { Metadata } from "next";
import { CitationBlock } from "@/components/content/citation-block";
import { ResourceCard } from "@/components/content/resource-card";
import { SectionHeader } from "@/components/content/section-header";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { resourceSections } from "@/lib/data/resources";
import { generateResourcesText } from "@/lib/copy-text-generators";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { JsonLd, datasetSchema } from "@/lib/structured-data";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/resources", l);
}

export default async function ResourcesPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];

  return (
    <SupplementaryPageShell
      slug="/resources"
      locale={l}
      subtitle={t.resourcesSubtitle}
      title={t.resourcesTitle}
      description={t.resourcesDescription}
      rawContent={generateResourcesText(resourceSections, l)}
    >
      <JsonLd data={datasetSchema({
        name: `Catalunya 2022 - RESET: ${t.tagline}`,
        description: t.resourcesDescription,
        locale: l,
      })} />
      {resourceSections.map((section) => (
        <section key={section.title.en} className="mb-16" aria-labelledby={`section-${section.title.en}`}>
          <SectionHeader subtitle={section.label[l]} title={section.title[l]} id={`section-${section.title.en}`}>
            <p className="mt-2 text-sm text-muted-foreground">
              {section.description[l]}
            </p>
          </SectionHeader>
          <div className="grid gap-5 sm:grid-cols-2">
            {section.items.map((item) => (
              <ResourceCard
                key={`${item.title.en}-${typeof item.description === "string" ? item.description : item.description.en}`}
                item={item}
                locale={l}
              />
            ))}
          </div>
        </section>
      ))}
      <CitationBlock locale={l} />
    </SupplementaryPageShell>
  );
}
