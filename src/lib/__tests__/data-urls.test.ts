import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
});
