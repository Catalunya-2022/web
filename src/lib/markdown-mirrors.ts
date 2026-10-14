/**
 * Stale-mirror sweep for the per-page markdown mirrors that
 * scripts/generate-document-markdown.ts writes under public/ (gitignored build
 * output at <page-url>.md). The generator owns every .md file below public/
 * except the downloads in public/documents/ and anything else git tracks;
 * whatever is left in that set after a run and was not just regenerated is
 * stale and removed, and the directories it emptied are pruned up to, never
 * including, public/.
 */

import { execFileSync } from "child_process";
import fs from "fs/promises";
import path from "path";

/** Every .md file below publicDir, except those inside documentsDir. */
export async function listExistingMirrors(publicDir: string, documentsDir: string): Promise<string[]> {
  const entries = await fs.readdir(publicDir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((file) => !file.startsWith(`${documentsDir}${path.sep}`));
}

/**
 * Absolute paths of the files git tracks below dir. Empty when dir is not in a
 * git work tree (a scratch export), which leaves the sweep with the
 * documents/ exclusion alone.
 */
export function listTrackedFiles(dir: string): Set<string> {
  try {
    const out = execFileSync("git", ["ls-files", "-z"], { cwd: dir, stdio: ["ignore", "pipe", "ignore"] });
    return new Set(
      out
        .toString("utf-8")
        .split("\0")
        .filter(Boolean)
        .map((relative) => path.join(dir, relative)),
    );
  } catch {
    return new Set();
  }
}

/** Existing mirrors that were neither regenerated this run nor tracked by git. */
export function selectStaleMirrors(
  existing: readonly string[],
  fresh: Pick<ReadonlySet<string>, "has">,
  tracked: Pick<ReadonlySet<string>, "has">,
): string[] {
  return existing.filter((file) => !fresh.has(file) && !tracked.has(file));
}

async function isEmptyDir(dir: string): Promise<boolean> {
  try {
    return (await fs.readdir(dir)).length === 0;
  } catch {
    return false;
  }
}

/** Remove the stale files, then prune each directory they emptied, stopping at publicDir. */
export async function removeStaleMirrors(stale: readonly string[], publicDir: string): Promise<void> {
  await Promise.all(stale.map((file) => fs.rm(file, { force: true })));
  for (const dir of new Set(stale.map((file) => path.dirname(file)))) {
    let current = dir;
    while (current !== publicDir && (await isEmptyDir(current))) {
      await fs.rmdir(current);
      current = path.dirname(current);
    }
  }
}
