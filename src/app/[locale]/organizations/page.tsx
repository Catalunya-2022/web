import type { Metadata } from "next";
import { OrgTable } from "@/components/content/org-table";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { organizations } from "@/lib/data/organizations";
import { generateOrganizationsText } from "@/lib/copy-text-generators";
import { normalizeForSearch } from "@/lib/search-normalization";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/organizations", l);
}

export default async function OrganizationsPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];

  return (
    <SupplementaryPageShell
      slug="/organizations"
      locale={l}
      subtitle={t.organizationsSubtitle}
      title={t.organizationsTitle}
      description={t.organizationsDescription}
      rawContent={generateOrganizationsText(organizations, l)}
    >
      <OrgTable
        organizations={organizations.map((org) => ({
          name: org.name[l],
          normalizedName: normalizeForSearch(org.name[l]),
          website: org.website,
        }))}
        locale={l}
      />
    </SupplementaryPageShell>
  );
}
