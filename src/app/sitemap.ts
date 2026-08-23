import type { MetadataRoute } from "next";
import { getManifest } from "@/lib/content-manifest";
import { teamMembers } from "@/lib/data/team-members";
import { buildAbsoluteUrl } from "@/lib/metadata";
import { getContentLastModified, getTaskForceLastModified } from "@/lib/content-dates";
import { routing } from "@/i18n/routing";

const LOCALES = routing.locales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getManifest("en");
  const entries: MetadataRoute.Sitemap = [];

  for (const slug of manifest.readingOrder) {
    for (const locale of LOCALES) {
      entries.push({
        url: buildAbsoluteUrl(slug, locale),
        lastModified: getContentLastModified(slug),
        alternates: {
          languages: {
            ca: buildAbsoluteUrl(slug, "ca"),
            en: buildAbsoluteUrl(slug, "en"),
            es: buildAbsoluteUrl(slug, "es"),
            "x-default": buildAbsoluteUrl(slug, "ca"),
          },
        },
      });
    }
  }

  for (const member of teamMembers) {
    const slug = `/task-force/${member.slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: buildAbsoluteUrl(slug, locale),
        lastModified: getTaskForceLastModified(),
        alternates: {
          languages: {
            ca: buildAbsoluteUrl(slug, "ca"),
            en: buildAbsoluteUrl(slug, "en"),
            es: buildAbsoluteUrl(slug, "es"),
            "x-default": buildAbsoluteUrl(slug, "ca"),
          },
        },
      });
    }
  }

  return entries;
}
