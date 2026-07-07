import type { Metadata } from "next";
import { Play } from "lucide-react";
import { PressCard } from "@/components/content/press-card";
import { SectionHeader } from "@/components/content/section-header";
import { PressTable } from "@/components/content/press-table";
import { SupplementaryPageShell } from "@/components/content/supplementary-page-shell";
import { pressSections, youtubeVideo } from "@/lib/data/press-coverage";
import { generatePressText } from "@/lib/copy-text-generators";
import { uiStrings } from "@/lib/ui-strings";
import { supplementaryMetadata } from "@/lib/metadata";
import { JsonLd, videoSchema } from "@/lib/structured-data";
import { resolveRouteLocale, setResolvedRequestLocale } from "@/lib/route-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await resolveRouteLocale(params);
  return supplementaryMetadata("/press", l);
}

export default async function PressPage({ params }: Props) {
  const l = await setResolvedRequestLocale(params);
  const t = uiStrings[l];

  return (
    <SupplementaryPageShell
      slug="/press"
      locale={l}
      subtitle={t.pressSubtitle}
      title={t.pressTitle}
      description={t.pressDescription}
      rawContent={generatePressText(pressSections, youtubeVideo, l)}
    >
      <JsonLd data={videoSchema({
        name: youtubeVideo.title[l],
        description: youtubeVideo.description[l],
        videoId: youtubeVideo.id,
        uploadDate: "2021-06-10T00:00:00+02:00",
        locale: l,
      })} />
      <div className="mb-12 overflow-hidden rounded-xl border bg-card">
        <div className="grid md:grid-cols-5">
          <div className="relative overflow-hidden md:col-span-3">
            <div className="relative aspect-video md:h-full md:aspect-auto">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideo.id}?start=${youtubeVideo.start}`}
                title={youtubeVideo.title[l]}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                className="absolute inset-0 size-full"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:col-span-2 md:p-8">
            <div className="flex items-center gap-2 text-primary">
              <Play className="size-4 fill-current" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.featuredVideo}
              </span>
            </div>
            <a
              href={youtubeVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h2 className="text-base font-semibold leading-snug group-hover:text-primary sm:text-lg">
                {youtubeVideo.title[l]}
              </h2>
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {youtubeVideo.description[l]}
            </p>
            <div className="mt-auto text-xs text-muted-foreground">
              <p>{youtubeVideo.date[l]}</p>
              <p>{youtubeVideo.location}</p>
            </div>
          </div>
        </div>
      </div>

      {pressSections.map((section) => (
        <section key={section.id} className="mb-16" aria-labelledby={`section-${section.id}`}>
          <SectionHeader subtitle={section.label[l]} title={section.title[l]} id={`section-${section.id}`} />
          <div className="mb-8 grid gap-5 sm:grid-cols-2">
            {section.articles
              .filter((a) => a.highlighted)
              .map((article) => (
                <PressCard key={article.url} article={article} locale={l} />
              ))}
          </div>
          <PressTable
            articles={section.articles.filter((a) => !a.highlighted)}
            locale={l}
          />
        </section>
      ))}
    </SupplementaryPageShell>
  );
}
