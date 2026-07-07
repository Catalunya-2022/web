import { describe, it, expect } from "vitest";
import {
  breadcrumbListSchema,
  articleSchema,
  organizationSchema,
  webSiteSchema,
  profilePageSchema,
  videoSchema,
  softwareApplicationSchema,
  datasetSchema,
  JsonLd,
} from "../structured-data";
import { uiStrings } from "../ui-strings";

const DOI_URL = "https://doi.org/10.5281/zenodo.19500831";

describe("breadcrumbListSchema", () => {
  it("maps items to 1-based ListItem positions", () => {
    const schema = breadcrumbListSchema([
      { name: "Home", url: "https://2022.cat/" },
      { name: "Sphere 2", url: "https://2022.cat/en/sphere-2" },
    ]);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://2022.cat/" },
      { "@type": "ListItem", position: 2, name: "Sphere 2", item: "https://2022.cat/en/sphere-2" },
    ]);
  });

  it("produces an empty list for no items", () => {
    expect(breadcrumbListSchema([]).itemListElement).toEqual([]);
  });
});

describe("articleSchema", () => {
  const base = {
    title: "Action 1.1",
    description: "Desc",
    url: "https://2022.cat/en/sphere-1/goal-1/action-1-1",
    locale: "en" as const,
  };

  it("builds the Article envelope with BCP 47 inLanguage", () => {
    const schema = articleSchema(base);
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Action 1.1");
    expect(schema.url).toBe(base.url);
    expect(schema.inLanguage).toBe("en-US");
    expect(articleSchema({ ...base, locale: "ca" }).inLanguage).toBe("ca-ES");
    expect(articleSchema({ ...base, locale: "es" }).inLanguage).toBe("es-ES");
  });

  it("defaults datePublished to the document publication date (CEST)", () => {
    expect(articleSchema(base).datePublished).toBe("2021-06-01T00:00:00+02:00");
  });

  it("honors an explicit datePublished", () => {
    expect(
      articleSchema({ ...base, datePublished: "2026-01-01" }).datePublished
    ).toBe("2026-01-01");
  });

  it("cites the DOI and carries the CC BY 4.0 license", () => {
    const schema = articleSchema(base);
    expect(schema.license).toBe("https://creativecommons.org/licenses/by/4.0/");
    expect(schema.citation["@id"]).toBe(DOI_URL);
    expect(schema.citation.name).toContain("Catalunya 2022 - RESET");
    expect(schema.author.name).toBe("Grup de Treball Catalunya 2022");
    expect(schema.publisher.name).toBe("Catalunya 2022");
  });
});

describe("organizationSchema / webSiteSchema", () => {
  it.each(["ca", "en", "es"] as const)(
    "uses the %s tagline and site description",
    (locale) => {
      const org = organizationSchema(locale);
      const site = webSiteSchema(locale);
      expect(org.alternateName).toBe(
        `Catalunya 2022 - RESET: ${uiStrings[locale].ogTagline}`
      );
      expect(org.description).toBe(uiStrings[locale].siteDescription);
      expect(site.alternateName).toBe(org.alternateName);
      expect(site.description).toBe(org.description);
    }
  );

  it("carries no sameAs until an entity-identity page (Wikipedia) exists", () => {
    const org = organizationSchema("ca");
    expect(org).not.toHaveProperty("sameAs");
    expect(org.logo).toEqual({
      "@type": "ImageObject",
      url: "https://2022.cat/icons/icon-512.png",
      width: 512,
      height: 512,
    });
  });

  it("maps webSite inLanguage per locale", () => {
    expect(webSiteSchema("ca").inLanguage).toBe("ca-ES");
    expect(webSiteSchema("en").inLanguage).toBe("en-US");
    expect(webSiteSchema("es").inLanguage).toBe("es-ES");
  });
});

describe("profilePageSchema", () => {
  const base = {
    name: "Victòria Alsina",
    url: "https://2022.cat/grup-de-treball/victoria-alsina",
    locale: "ca" as const,
  };

  it("wraps a Person as mainEntity with task-force membership", () => {
    const schema = profilePageSchema(base);
    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.name).toBe(base.name);
    expect(schema.mainEntity.memberOf.name).toBe("Grup de Treball Catalunya 2022");
  });

  it("localizes the memberOf URL to the task-force listing", () => {
    expect(profilePageSchema(base).mainEntity.memberOf.url).toBe(
      "https://2022.cat/grup-de-treball"
    );
    expect(
      profilePageSchema({ ...base, locale: "en" }).mainEntity.memberOf.url
    ).toBe("https://2022.cat/en/task-force");
    expect(
      profilePageSchema({ ...base, locale: "es" }).mainEntity.memberOf.url
    ).toBe("https://2022.cat/es/grupo-de-trabajo");
  });

  it("omits sameAs when undefined or empty, includes it when populated", () => {
    expect(profilePageSchema(base).mainEntity).not.toHaveProperty("sameAs");
    expect(
      profilePageSchema({ ...base, sameAs: [] }).mainEntity
    ).not.toHaveProperty("sameAs");
    expect(
      profilePageSchema({ ...base, sameAs: ["https://example.org"] }).mainEntity
        .sameAs
    ).toEqual(["https://example.org"]);
  });
});

describe("videoSchema", () => {
  it("derives thumbnail and privacy-preserving embed URLs from the video id", () => {
    const schema = videoSchema({
      name: "Presentation",
      description: "Desc",
      videoId: "abc123",
      uploadDate: "2020-07-13",
      locale: "ca",
    });
    expect(schema.thumbnailUrl).toBe(
      "https://img.youtube.com/vi/abc123/maxresdefault.jpg"
    );
    expect(schema.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/abc123"
    );
    expect(schema.uploadDate).toBe("2020-07-13");
  });
});

describe("softwareApplicationSchema", () => {
  it("declares a free cross-platform developer application", () => {
    const schema = softwareApplicationSchema({
      name: "MCP Server",
      description: "Desc",
      url: "https://2022.cat/mcp",
      locale: "en",
    });
    expect(schema.applicationCategory).toBe("DeveloperApplication");
    expect(schema.operatingSystem).toBe("Any");
    expect(schema.offers).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    });
  });
});

describe("datasetSchema", () => {
  it("identifies the dataset by DOI with one PDF distribution per locale", () => {
    const schema = datasetSchema({ name: "N", description: "D", locale: "ca" });
    expect(schema.url).toBe(DOI_URL);
    expect(schema.identifier).toBe(DOI_URL);
    expect(schema.license).toBe("https://creativecommons.org/licenses/by/4.0/");
    expect(schema.distribution.map((d) => d.inLanguage)).toEqual(["ca", "en", "es"]);
    for (const dist of schema.distribution) {
      expect(dist.encodingFormat).toBe("application/pdf");
      expect(dist.contentUrl).toMatch(
        /^https:\/\/2022\.cat\/documents\/catalunya-2022-(ca|en|es)\.pdf$/
      );
    }
  });
});

describe("every schema builder", () => {
  it("emits the schema.org @context", () => {
    const schemas = [
      breadcrumbListSchema([]),
      articleSchema({ title: "t", url: "u", locale: "ca" }),
      organizationSchema("ca"),
      webSiteSchema("ca"),
      profilePageSchema({ name: "n", url: "u", locale: "ca" }),
      videoSchema({ name: "n", description: "d", videoId: "v", uploadDate: "2020-01-01", locale: "ca" }),
      softwareApplicationSchema({ name: "n", description: "d", url: "u", locale: "ca" }),
      datasetSchema({ name: "n", description: "d", locale: "ca" }),
    ];
    for (const schema of schemas) {
      expect(schema["@context"]).toBe("https://schema.org");
    }
  });
});

describe("JsonLd", () => {
  it("renders a JSON-LD script element", () => {
    const el = JsonLd({ data: { "@type": "Thing", name: "x" } });
    expect(el.type).toBe("script");
    const props = el.props as {
      type: string;
      dangerouslySetInnerHTML: { __html: string };
    };
    expect(props.type).toBe("application/ld+json");
    expect(JSON.parse(props.dangerouslySetInnerHTML.__html)).toEqual({
      "@type": "Thing",
      name: "x",
    });
  });

  it("escapes < so data cannot break out of the script tag", () => {
    const el = JsonLd({ data: { name: '</script><b>"quoted"' } });
    const html = (el.props as { dangerouslySetInnerHTML: { __html: string } })
      .dangerouslySetInnerHTML.__html;
    expect(html).not.toContain("<");
    expect(html).toContain("\\u003c/script>");
    // still valid JSON after escaping
    expect(JSON.parse(html)).toEqual({ name: '</script><b>"quoted"' });
  });
});
