import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resourceSections } from "../data/resources";

const dataDir = path.join(process.cwd(), "src/lib/data");

describe("static data URLs", () => {
  it("does not ship plaintext http links in lib/data", async () => {
    const files = (await readdir(dataDir)).filter((file) => file.endsWith(".ts"));
    const offenders: string[] = [];

    for (const file of files) {
      const source = await readFile(path.join(dataDir, file), "utf8");
      if (source.includes('"http://')) {
        offenders.push(file);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps the full-document download cards on the literal download paths", () => {
    const documents = resourceSections.find((section) => section.id === "documents");
    const cards = documents?.items.filter((item) => item.downloads?.some((d) => d.href.includes("catalunya-2022-ca.")));
    expect(cards?.map((card) => card.downloads)).toEqual([
      [
        { lang: "Català", href: "/documents/catalunya-2022-ca.pdf" },
        { lang: "Español", href: "/documents/catalunya-2022-es.pdf" },
        { lang: "English", href: "/documents/catalunya-2022-en.pdf" },
      ],
      [
        { lang: "Català", href: "/documents/catalunya-2022-ca.epub" },
        { lang: "Español", href: "/documents/catalunya-2022-es.epub" },
        { lang: "English", href: "/documents/catalunya-2022-en.epub" },
      ],
      [
        { lang: "Català", href: "/documents/catalunya-2022-ca.md" },
        { lang: "Español", href: "/documents/catalunya-2022-es.md" },
        { lang: "English", href: "/documents/catalunya-2022-en.md" },
      ],
    ]);
  });
});
