import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  listExistingMirrors,
  listTrackedFiles,
  removeStaleMirrors,
  selectStaleMirrors,
} from "../markdown-mirrors";

const tempDirs: string[] = [];

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "markdown-mirrors-"));
  tempDirs.push(dir);
  return dir;
}

function writeFile(file: string, content = "# page\n"): string {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("listExistingMirrors", () => {
  it("lists every .md below public/ except the documents/ downloads", async () => {
    const publicDir = makeTempDir();
    const documentsDir = path.join(publicDir, "documents");
    const topLevel = writeFile(path.join(publicDir, "introduccio.md"));
    const nested = writeFile(path.join(publicDir, "en", "sphere-1", "goal-1.md"));
    const samePrefixSibling = writeFile(path.join(publicDir, "documents-extra", "note.md"));
    writeFile(path.join(documentsDir, "catalunya-2022-ca.md"));
    writeFile(path.join(publicDir, "search-corpus-ca.json"), "[]");
    writeFile(path.join(publicDir, "en", "sphere-1", "goal-1.txt"), "not markdown");

    const found = await listExistingMirrors(publicDir, documentsDir);

    expect([...found].sort()).toEqual([topLevel, nested, samePrefixSibling].sort());
  });

  it("returns nothing for an empty public/", async () => {
    const publicDir = makeTempDir();

    expect(await listExistingMirrors(publicDir, path.join(publicDir, "documents"))).toEqual([]);
  });
});

describe("selectStaleMirrors", () => {
  it("keeps regenerated and git-tracked files out of the stale set", () => {
    const existing = ["/public/a.md", "/public/b.md", "/public/c.md"];

    expect(selectStaleMirrors(existing, new Set(["/public/a.md"]), new Set(["/public/c.md"]))).toEqual([
      "/public/b.md",
    ]);
  });

  it("accepts the generator's Map of fresh mirrors", () => {
    const fresh = new Map([["/public/en/introduction.md", "# Introduction\n"]]);

    expect(selectStaleMirrors(["/public/en/introduction.md", "/public/en/old.md"], fresh, new Set())).toEqual([
      "/public/en/old.md",
    ]);
  });
});

describe("removeStaleMirrors", () => {
  it("removes stale files, prunes the directories they emptied and keeps public/ itself", async () => {
    const publicDir = makeTempDir();
    const stale = writeFile(path.join(publicDir, "es", "ambito-9", "objetivo-1.md"));
    const kept = writeFile(path.join(publicDir, "es", "ambito-1", "objetivo-1.md"));
    const topLevelStale = writeFile(path.join(publicDir, "old.md"));

    await removeStaleMirrors([stale, topLevelStale], publicDir);

    expect(fs.existsSync(stale)).toBe(false);
    expect(fs.existsSync(topLevelStale)).toBe(false);
    expect(fs.existsSync(path.join(publicDir, "es", "ambito-9"))).toBe(false);
    expect(fs.existsSync(kept)).toBe(true);
    expect(fs.existsSync(path.join(publicDir, "es"))).toBe(true);
    expect(fs.existsSync(publicDir)).toBe(true);
  });

  it("prunes a whole chain of emptied directories but stops at public/", async () => {
    const publicDir = makeTempDir();
    const stale = writeFile(path.join(publicDir, "en", "sphere-9", "goal-9", "action-9-9.md"));

    await removeStaleMirrors([stale], publicDir);

    expect(fs.existsSync(path.join(publicDir, "en"))).toBe(false);
    expect(fs.existsSync(publicDir)).toBe(true);
  });

  it("leaves a directory in place when any other file remains in it", async () => {
    const publicDir = makeTempDir();
    const stale = writeFile(path.join(publicDir, "en", "stale.md"));
    const other = writeFile(path.join(publicDir, "en", "keep.json"), "{}");

    await removeStaleMirrors([stale], publicDir);

    expect(fs.existsSync(stale)).toBe(false);
    expect(fs.existsSync(other)).toBe(true);
  });

  it("tolerates a stale entry that has already disappeared", async () => {
    const publicDir = makeTempDir();

    await expect(removeStaleMirrors([path.join(publicDir, "gone", "page.md")], publicDir)).resolves.toBeUndefined();
    expect(fs.existsSync(publicDir)).toBe(true);
  });
});

describe("listTrackedFiles", () => {
  it("returns the absolute paths git tracks below the directory", () => {
    const repo = makeTempDir();
    execFileSync("git", ["init", "-q"], { cwd: repo });
    const publicDir = path.join(repo, "public");
    const tracked = writeFile(path.join(publicDir, "documents", "catalunya-2022-ca.md"));
    writeFile(path.join(publicDir, "en", "untracked.md"));
    execFileSync("git", ["add", "public/documents/catalunya-2022-ca.md"], { cwd: repo });

    expect(listTrackedFiles(publicDir)).toEqual(new Set([tracked]));
  });

  it("is empty outside a git work tree", () => {
    const dir = makeTempDir();
    writeFile(path.join(dir, "a.md"));

    expect(listTrackedFiles(dir)).toEqual(new Set());
  });
});
