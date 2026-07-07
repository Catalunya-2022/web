import { describe, expect, it } from "vitest";
import {
  STATIC_CONTENT_SLUGS,
  SUPPLEMENTARY_PAGE_SLUGS,
  buildContentDocumentSlugs,
  buildReadingOrder,
  getSupplementaryPageCopy,
} from "../page-registry";

describe("page-registry", () => {
  it("builds the full reading order from a single shared registry", () => {
    const readingOrder = buildReadingOrder();

    expect(readingOrder.slice(0, 5)).toEqual([
      "/",
      "/introduction",
      "/executive-summary",
      "/train-of-prosperity",
      "/action-plan",
    ]);
    expect(readingOrder.at(-1)).toBe("/mcp");
    expect(readingOrder).toHaveLength(117);
  });

  it("builds only MDX-backed content slugs for content loaders", () => {
    const contentSlugs = buildContentDocumentSlugs();

    expect(contentSlugs[0]).toBe("/introduction");
    expect(contentSlugs).toContain("/sphere-3/goal-12/action-12-5");
    expect(contentSlugs).toHaveLength(109);
  });

  it("keeps the static and supplementary route registries explicit", () => {
    expect(STATIC_CONTENT_SLUGS).toEqual([
      "/introduction",
      "/executive-summary",
      "/train-of-prosperity",
    ]);
    expect(SUPPLEMENTARY_PAGE_SLUGS).toEqual([
      "/action-plan",
      "/task-force",
      "/people-consulted",
      "/organizations",
      "/press",
      "/resources",
      "/mcp",
    ]);
  });

  it("derives supplementary page copy from one canonical definition", () => {
    expect(getSupplementaryPageCopy("/action-plan", "en")).toEqual(
      expect.objectContaining({
        identifier: "Action Plan",
        title: "Reset: Call to reactivate Catalonia",
        pageTitle: "Action Plan",
      })
    );
    expect(
      getSupplementaryPageCopy("/action-plan", "en").description
    ).toContain("12 goals and 91 concrete actions");
  });
});
