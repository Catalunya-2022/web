import fs from "fs/promises";
import path from "path";
import { routing, type Locale } from "../src/i18n/routing";
import {
  buildCuratedIndex,
  buildFullDocumentSource,
  buildLlmsPath,
  collectLocaleData,
  type LocaleData,
} from "../src/lib/llms-index";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const LOCALES = routing.locales;

async function copyFullContext(locale: Locale): Promise<void> {
  const sourceFile = path.join(PUBLIC_DIR, buildFullDocumentSource(locale));
  const targetFile = path.join(PUBLIC_DIR, buildLlmsPath(locale, "full"));

  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.copyFile(sourceFile, targetFile);
}

async function writeCuratedIndex(
  locale: Locale,
  localeData: LocaleData
): Promise<void> {
  const targetFile = path.join(PUBLIC_DIR, buildLlmsPath(locale, "curated"));

  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, buildCuratedIndex(locale, localeData), "utf8");
}

async function main(): Promise<void> {
  for (const locale of LOCALES) {
    const localeData = await collectLocaleData(locale);
    await writeCuratedIndex(locale, localeData);
    await copyFullContext(locale);
  }

  for (const locale of LOCALES) {
    const curatedPath = path.join(PUBLIC_DIR, buildLlmsPath(locale, "curated"));
    const fullPath = path.join(PUBLIC_DIR, buildLlmsPath(locale, "full"));
    const curatedSize = (await fs.stat(curatedPath)).size;
    const fullSize = (await fs.stat(fullPath)).size;
    console.log(`${buildLlmsPath(locale, "curated")}: ${curatedSize} bytes`);
    console.log(`${buildLlmsPath(locale, "full")}: ${fullSize} bytes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
