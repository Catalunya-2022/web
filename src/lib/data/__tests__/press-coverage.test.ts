import { describe, expect, it } from "vitest";
import type { Locale } from "@/i18n/routing";
import { pressSections, youtubeVideo } from "../press-coverage";

const articles = pressSections.flatMap((section) => section.articles);
const countLang = (lang?: Locale) => articles.filter((article) => article.lang === lang).length;

describe("press coverage data", () => {
  it("tags every Catalan or Spanish title with its language", () => {
    expect(articles).toHaveLength(38);

    expect({ ca: countLang("ca"), es: countLang("es"), en: countLang("en"), untagged: countLang() }).toEqual({
      ca: 28,
      es: 8,
      en: 0,
      untagged: 2,
    });
    expect(articles.filter((a) => a.lang === undefined).map((a) => a.title)).toEqual([
      "Reset",
      "Catalunya 2022",
    ]);
  });

  it("carries the featured video upload date as a full ISO datetime", () => {
    expect(youtubeVideo.uploadDate).toBe("2021-06-10T00:00:00+02:00");
    expect(Number.isNaN(Date.parse(youtubeVideo.uploadDate))).toBe(false);
  });
});
