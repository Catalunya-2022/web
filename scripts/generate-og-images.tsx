/**
 * Build-time script: generates static OG images for all pages × locales.
 * Run via: node --import tsx scripts/generate-og-images.tsx
 *
 * Outputs 441 PNG images (147 pages × 3 locales) to public/og/
 * with locale-translated filenames matching the site's URL structure.
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import path from "node:path";
import { routing, type Locale } from "../src/i18n/routing";
import { OGTemplate, OG_SIZE, getFontData, type OGImageProps } from "../src/lib/og-template";
import { ogImagePath } from "../src/lib/metadata";
import {
  extractHeadings,
  slugToFilePath,
  getContentDir,
} from "../src/lib/content-utils";
import {
  resolveTeamPhotoPath,
  getTeamPhotoMimeType,
} from "../src/lib/team-photos";
import {
  STATIC_CONTENT_SLUGS,
  SUPPLEMENTARY_PAGE_SLUGS,
  getSupplementaryPageCopy,
  getSphereIds,
  getGoalRoutes,
  getActionRoutes,
  type SupplementaryPageSlug,
} from "../src/lib/page-registry";
import {
  buildCanonicalSpherePath,
  buildCanonicalGoalPath,
  buildCanonicalActionPath,
} from "../src/lib/path-utils";
import { uiStrings } from "../src/lib/ui-strings";
import { teamMembers } from "../src/lib/data/team-members";

const LOCALES = routing.locales;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const OG_DIR = path.join(PUBLIC_DIR, "og");
const BATCH_SIZE = parseInt(process.env.OG_BATCH_SIZE ?? "8", 10);

type OGImageSpec = {
  slug: string;
  locale: Locale;
  props: OGImageProps;
};

/** Read an MDX file and extract H1/H2 headings. */
function loadHeadings(
  slug: string,
  locale: Locale,
): { h1: string; h2: string } {
  const contentDir = getContentDir(locale);
  const filePath = slugToFilePath(slug, contentDir);
  const raw = readFileSync(filePath, "utf-8");
  try {
    const { h1, h2 } = extractHeadings(raw);
    return { h1, h2 };
  } catch (e) {
    throw new Error(
      `Failed to extract headings for ${slug} (${locale}): ${e instanceof Error ? e.message : e}`,
    );
  }
}

/** Pre-load all 30 team photos as base64 data URIs (read once, reuse across locales). */
async function loadAllPhotos(): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  for (const member of teamMembers) {
    const photoPath = resolveTeamPhotoPath(member.photo);
    if (!photoPath) {
      throw new Error(`Invalid photo for ${member.slug}: ${member.photo}`);
    }
    const buf = await readFile(photoPath);
    const mime = getTeamPhotoMimeType(member.photo);
    cache.set(
      member.photo,
      `data:${mime};base64,${buf.toString("base64")}`,
    );
  }
  return cache;
}

/** Collect all 147 page specs × 3 locales = 441 total. */
function buildAllSpecs(photoCache: Map<string, string>): OGImageSpec[] {
  const specs: OGImageSpec[] = [];

  for (const locale of LOCALES) {
    const t = uiStrings[locale];

    // 1. Home (1)
    specs.push({
      slug: "/",
      locale,
      props: { title: "", subtitle: t.homeOgSubtitle, locale, variant: "home" },
    });

    // 2. Content articles (3)
    for (const slug of STATIC_CONTENT_SLUGS) {
      const { h1, h2 } = loadHeadings(slug, locale);
      specs.push({
        slug,
        locale,
        props: { title: h1, subtitle: h2, locale },
      });
    }

    // 3. Supplementary pages (7)
    for (const slug of SUPPLEMENTARY_PAGE_SLUGS) {
      const copy = getSupplementaryPageCopy(slug as SupplementaryPageSlug, locale);
      const isActionPlan = slug === "/action-plan";
      specs.push({
        slug,
        locale,
        props: {
          title: isActionPlan ? copy.identifier : copy.title,
          subtitle: isActionPlan ? t.homeOgSubtitle : copy.identifier,
          locale,
        },
      });
    }

    // 4. Spheres (3)
    for (const sphereId of getSphereIds()) {
      const slug = buildCanonicalSpherePath(sphereId);
      const { h1, h2 } = loadHeadings(slug, locale);
      specs.push({
        slug,
        locale,
        props: {
          label: t.actionPlan,
          heading: h1,
          title: h2,
          locale,
        },
      });
    }

    // 5. Goals (12)
    for (const { sphereId, goalId } of getGoalRoutes()) {
      const slug = buildCanonicalGoalPath(sphereId, goalId);
      const { h1, h2 } = loadHeadings(slug, locale);
      specs.push({
        slug,
        locale,
        props: {
          label: `${t.actionPlan} \u203a ${t.sphere} ${sphereId}`,
          heading: h1,
          title: h2,
          locale,
        },
      });
    }

    // 6. Actions (91)
    for (const { sphereId, goalId, actionId } of getActionRoutes()) {
      const slug = buildCanonicalActionPath(sphereId, goalId, actionId);
      const { h1, h2 } = loadHeadings(slug, locale);
      specs.push({
        slug,
        locale,
        props: {
          label: `${t.actionPlan} \u203a ${t.sphere} ${sphereId} \u203a ${t.goal} ${goalId}`,
          heading: h1,
          title: h2,
          locale,
        },
      });
    }

    // 7. Members (30)
    for (const member of teamMembers) {
      const photoSrc = photoCache.get(member.photo);
      if (!photoSrc) {
        throw new Error(`Photo not cached for ${member.slug}`);
      }
      specs.push({
        slug: `/task-force/${member.slug}`,
        locale,
        props: {
          title: member.name,
          subtitle: member.role[locale],
          locale,
          photoSrc,
        },
      });
    }
  }

  return specs;
}

async function main() {
  const start = performance.now();

  // Safety: verify OG_DIR is inside public/
  if (!path.resolve(OG_DIR).startsWith(path.resolve(PUBLIC_DIR))) {
    throw new Error(`Refusing to clean unexpected directory: ${OG_DIR}`);
  }

  // 1. Clean output directory
  await rm(OG_DIR, { recursive: true, force: true });

  // 2. Load font once, cache photos once (30 reads, not 90)
  const fontData = await getFontData();
  const photoCache = await loadAllPhotos();

  // 3. Collect all image specs
  const specs = buildAllSpecs(photoCache);
  const expectedCount = 147 * LOCALES.length;
  if (specs.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} specs, got ${specs.length}`);
  }

  // 4. Pre-create all unique output directories
  const allDirs = new Set(
    specs.map((s) =>
      path.dirname(path.join(PUBLIC_DIR, ogImagePath(s.slug, s.locale))),
    ),
  );
  await Promise.all([...allDirs].map((dir) => mkdir(dir, { recursive: true })));

  // 5. Render in batches
  const fonts = [
    { name: "Outfit", data: fontData, weight: 700 as const },
  ];
  let count = 0;
  for (let i = 0; i < specs.length; i += BATCH_SIZE) {
    await Promise.all(
      specs.slice(i, i + BATCH_SIZE).map(async (spec) => {
        const svg = await satori(<OGTemplate {...spec.props} />, {
          ...OG_SIZE,
          fonts,
        });
        const png = new Resvg(svg, {
          fitTo: { mode: "original" },
        })
          .render()
          .asPng();

        const filePath = path.join(
          PUBLIC_DIR,
          ogImagePath(spec.slug, spec.locale),
        );
        // Containment check
        if (!path.resolve(filePath).startsWith(path.resolve(OG_DIR))) {
          throw new Error(`OG path escapes output directory: ${filePath}`);
        }
        await writeFile(filePath, png);
        count++;
      }),
    );
  }

  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  console.log(
    `[og-images] ${count} images (${count / LOCALES.length} x ${LOCALES.length} locales) in ${elapsed}s -> public/og/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
