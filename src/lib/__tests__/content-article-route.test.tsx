import { describe, it, expect } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import {
  generateContentArticleMetadata,
  renderStandaloneArticleContentPage,
} from "../content-article-route";
import { JsonLd } from "../structured-data";

/** Depth-first search for JsonLd elements without invoking any component. */
function findJsonLdData(node: ReactNode, out: object[] = []): object[] {
  if (Array.isArray(node)) {
    node.forEach((child) => findJsonLdData(child, out));
  } else if (isValidElement(node)) {
    if (node.type === JsonLd) {
      out.push((node.props as { data: object }).data);
    }
    findJsonLdData((node.props as { children?: ReactNode }).children, out);
  }
  return out;
}

describe("content article route (drives metadata for all content pages)", () => {
  it("builds canonical, hreflang and OG metadata from real content", async () => {
    const metadata = await generateContentArticleMetadata("/introduction", "en");

    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();

    const alternates = metadata.alternates!;
    expect(alternates.canonical).toBe("https://2022.cat/en/introduction");
    const languages = alternates.languages as Record<string, string>;
    expect(languages.ca).toBe("https://2022.cat/introduccio");
    expect(languages.en).toBe("https://2022.cat/en/introduction");
    expect(languages.es).toBe("https://2022.cat/es/introduccion");
    expect(languages["x-default"]).toBe("https://2022.cat/introduccio");

    const og = metadata.openGraph as { type: string; locale: string };
    expect(og.type).toBe("article");
    expect(og.locale).toBe("en_US");

    const twitter = metadata.twitter as { images: string[] | string };
    expect(JSON.stringify(twitter.images)).toContain("/og/");
  });

  it("localizes the canonical for the pathless ca default", async () => {
    const metadata = await generateContentArticleMetadata(
      "/sphere-1/goal-1/action-1-1",
      "ca"
    );
    expect(metadata.alternates!.canonical).toBe(
      "https://2022.cat/ambit-1/objectiu-1/accio-1-1"
    );
  });

  it("emits BreadcrumbList and Article JSON-LD with a live dateModified", async () => {
    const page = (await renderStandaloneArticleContentPage(
      "/executive-summary",
      "en"
    )) as ReactElement;

    const schemas = findJsonLdData(page) as Array<Record<string, unknown>>;
    const types = schemas.map((s) => s["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("Article");

    const article = schemas.find((s) => s["@type"] === "Article")!;
    expect(article.url).toBe("https://2022.cat/en/executive-summary");
    expect(article.inLanguage).toBe("en-US");
    expect(String(article.dateModified) >= "2026-08-16").toBe(true);
    expect(String(article.image)).toContain("/og/");
  });
});
