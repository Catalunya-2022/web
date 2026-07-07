import type { Metadata } from "next";
import { PeopleDirectory } from "@/components/content/people-directory";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { peopleConsulted } from "@/lib/data/people-consulted";
import { generatePeopleConsultedText } from "@/lib/copy-text-generators";
import { normalizeForSearch } from "@/lib/search-normalization";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/people-consulted", l);
}

export default async function PeopleConsultedPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];

  return (
    <SupplementaryPageShell
      slug="/people-consulted"
      locale={l}
      subtitle={t.peopleConsultedSubtitle}
      title={t.peopleConsultedTitle}
      description={<>
        {t.peopleConsultedDescription}{" "}
        <a
          href="https://www.europapress.es/catalunya/noticia-grupo-trabajo-catalunya-2022-llama-toda-comunidad-participar-plan-postcrisis-20200713123318.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 decoration-primary/40 transition-colors hover:decoration-primary"
        >
          {t.peopleConsultedOpenCall}
        </a>
        {" "}{t.peopleConsultedOpenCallContext}
      </>}
      rawContent={generatePeopleConsultedText(peopleConsulted, l)}
    >
      <PeopleDirectory
        people={peopleConsulted.map((person, index) => ({
          ...person,
          normalizedFirstName: normalizeForSearch(person.firstName),
          normalizedLastName: normalizeForSearch(person.lastName),
          groupLetter: normalizeForSearch(person.lastName).charAt(0).toUpperCase(),
          stableKey: `${person.firstName}-${person.lastName}-${index}`,
        }))}
        locale={l}
      />
    </SupplementaryPageShell>
  );
}
