import Image from "next/image";
import type { Metadata } from "next";
import { buildAlternates, buildOpenGraph, buildTwitter, buildOgImageUrl, buildAbsoluteUrl, BASE_URL } from "@/lib/metadata";
import { JsonLd, breadcrumbListSchema, profilePageSchema } from "@/lib/structured-data";
import { PageHeader } from "@/components/content/page-header";
import { PrevNextNav } from "@/components/content/prev-next-nav";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { PageActionBar } from "@/components/content/page-action-bar";
import { PrintHeader } from "@/components/content/print-header";
import { notFound } from "next/navigation";
import { XIcon } from "@/components/icons/x-icon";
import { WikipediaIcon } from "@/components/icons/wikipedia-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { BlueskyIcon } from "@/components/icons/bluesky-icon";
import { GlobeIcon } from "@/components/icons/globe-icon";
import { localizeHref } from "@/lib/path-utils";
import { teamMembers, getMemberBySlug } from "@/lib/data/team-members";
import {
  resolveRouteParams,
  setResolvedRequestParams,
} from "@/lib/route-locale";
import { stripMarkdownFormatting } from "@/lib/content-utils";
import { uiStrings } from "@/lib/ui-strings";
import type { TeamMember } from "@/lib/data/team-members";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; member: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return teamMembers.map((m) => ({ member: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l, member: slug } = await resolveRouteParams(params);
  const member = getMemberBySlug(slug);
  if (!member) notFound();
  const title = member.name;
  const description = member.bio[l].slice(0, 2).map(stripMarkdownFormatting).join(" ");
  return {
    title,
    description,
    alternates: buildAlternates(`/task-force/${slug}`, l),
    openGraph: buildOpenGraph({ title, description, locale: l, slug: `/task-force/${slug}`, type: "profile" }),
    twitter: buildTwitter({ title, description, image: buildOgImageUrl(`/task-force/${slug}`, l) }),
  };
}

const WIKIPEDIA_FALLBACK: Record<Locale, Locale[]> = {
  ca: ["ca", "es", "en"],
  es: ["es", "ca", "en"],
  en: ["en", "ca", "es"],
};

function pickWithFallback<T>(
  values: Partial<Record<Locale, T>>,
  order: Locale[]
): T | undefined {
  for (const locale of order) {
    if (values[locale] !== undefined) return values[locale];
  }
  return undefined;
}

function getWikipedia(member: TeamMember, locale: Locale): { url: string; label: string } | undefined {
  if (!member.wikipedia) return undefined;
  return pickWithFallback(member.wikipedia, WIKIPEDIA_FALLBACK[locale]);
}

/** Render **bold** markdown markers as <strong> tags in JSX */
function renderBio(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export default async function MemberProfilePage({ params }: Props) {
  const { locale: l, member: slug } = await setResolvedRequestParams(params);
  const t = uiStrings[l];

  const member = getMemberBySlug(slug);
  if (!member) notFound();
  const memberIndex = teamMembers.indexOf(member);

  const prev = memberIndex > 0 ? teamMembers[memberIndex - 1] : null;
  const next =
    memberIndex < teamMembers.length - 1 ? teamMembers[memberIndex + 1] : null;

  const wiki = getWikipedia(member, l);
  const hasLinks = member.links.length > 0 || !!wiki;

  const roleLabel = member.role[l];

  const memberUrl = buildAbsoluteUrl(`/task-force/${slug}`, l);
  const memberSlug = `/task-force/${slug}`;
  const rawContent = `# ${member.name}\n\n${roleLabel}\n\n${member.bio[l].map((line) => `- ${line}`).join("\n")}`;

  return (
    <>
      <CopyPageSetter title={member.name} slug={memberSlug} rawContent={rawContent} locale={l} />
      <PrintHeader locale={l} />
      <JsonLd data={breadcrumbListSchema([
        { name: t.home, url: buildAbsoluteUrl("/", l) },
        { name: t.taskForceTitle, url: buildAbsoluteUrl("/task-force", l) },
        { name: member.name, url: memberUrl },
      ])} />
      <JsonLd data={profilePageSchema({
        name: member.name,
        description: member.bio[l].slice(0, 2).map(stripMarkdownFormatting).join(" "),
        url: memberUrl,
        image: `${BASE_URL}/team-photos/${member.photo}`,
        sameAs: [
          ...member.links.map((link) => link.url),
          ...(wiki ? [wiki.url] : []),
        ],
        locale: l,
      })} />
      <PageActionBar
        slug={memberSlug}
        locale={l}
        title={member.name}
        rawContent={rawContent}
        memberName={member.name}
      />

      <PageHeader subtitle={roleLabel} title={member.name} />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex shrink-0 flex-col items-start sm:w-[220px]">
          <Image
            src={`/team-photos/${member.photo}`}
            alt={member.name}
            width={160}
            height={160}
            className="self-center rounded-full object-cover"
            priority
            sizes="160px"
          />

          {hasLinks && (
            <ul className="mx-auto mt-8 w-fit space-y-1.5 text-sm text-muted-foreground">
              {member.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  >
                    {link.type === "linkedin" && <LinkedinIcon className="size-4 shrink-0" />}
                    {link.type === "x" && <XIcon className="size-4 shrink-0" />}
                    {link.type === "bluesky" && <BlueskyIcon className="size-4 shrink-0" />}
                    {link.type === "website" && <GlobeIcon className="size-4 shrink-0" />}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
              {wiki && (
                <li>
                  <a
                    href={wiki.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  >
                    <WikipediaIcon className="size-4 shrink-0" />
                    <span>{wiki.label}</span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-li:my-1">
            <ul>
              {member.bio[l].map((line) => (
                <li key={line}>{renderBio(line)}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <PrevNextNav
        prev={prev ? {
          href: localizeHref(`/task-force/${prev.slug}`, l),
          label: t.previous,
          title: prev.name,
        } : null}
        next={next ? {
          href: localizeHref(`/task-force/${next.slug}`, l),
          label: t.next,
          title: next.name,
        } : null}
        ariaLabel={t.memberNavigation}
      />
    </>
  );
}
