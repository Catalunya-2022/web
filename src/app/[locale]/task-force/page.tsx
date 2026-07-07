import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { localizeHref } from "@/lib/path-utils";
import { teamMembers } from "@/lib/data/team-members";
import { generateTaskForceText } from "@/lib/copy-text-generators";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/task-force", l);
}

export default async function TaskForcePage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];

  return (
    <SupplementaryPageShell
      slug="/task-force"
      locale={l}
      subtitle={t.taskForceSubtitle}
      title={t.taskForceTitle}
      description={t.taskForceDescription}
      rawContent={generateTaskForceText(teamMembers, l)}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {teamMembers.map((member) => (
          <Link
            key={member.slug}
            href={localizeHref(`/task-force/${member.slug}`, l)}
            className="group flex flex-col items-center gap-3 rounded-lg border p-4 transition-colors hover:border-primary/30 hover:bg-accent"
          >
            <Image
              src={`/team-photos/${member.photo}`}
              alt={member.name}
              width={96}
              height={96}
              className="rounded-full object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
            <div className="text-center">
              <p className="font-heading text-lg font-semibold">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role[l]}</p>
            </div>
          </Link>
        ))}
      </div>
    </SupplementaryPageShell>
  );
}
