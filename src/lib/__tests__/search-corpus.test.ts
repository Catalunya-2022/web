import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildContentSearchDocument,
  generateCorpus,
  getExpectedSearchCorpusCount,
} from "../search-corpus";

const tempDirs: string[] = [];

function makeTempContentDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "search-corpus-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("buildContentSearchDocument", () => {
  it("builds a content document from MDX headings and body", () => {
    const contentDir = makeTempContentDir();
    const sphereDir = path.join(contentDir, "sphere1");
    fs.mkdirSync(sphereDir, { recursive: true });
    fs.writeFileSync(
      path.join(sphereDir, "sphere1.mdx"),
      "# Sphere 1\n\n## Subtitle\n\nBody paragraph.\n",
    );

    expect(buildContentSearchDocument("/sphere-1", "en", contentDir)).toEqual(
      expect.objectContaining({
        slug: "/sphere-1",
        type: "sphere",
        identifier: "Sphere 1",
        title: "Subtitle",
        breadcrumb: "Action Plan > Sphere 1",
        body: "Sphere 1 Subtitle Body paragraph.",
      }),
    );
  });

  it("throws a descriptive error when a content document is missing", () => {
    const contentDir = makeTempContentDir();

    expect(() =>
      buildContentSearchDocument("/introduction", "en", contentDir),
    ).toThrowError(
      /Failed to generate search corpus document for "\/introduction" \(locale: en, file: .*introduction\.mdx\):/,
    );
  });
});

describe("generateCorpus", () => {
  it("produces the full expected document count for a locale", () => {
    expect(generateCorpus("en")).toHaveLength(getExpectedSearchCorpusCount());
  });
});
