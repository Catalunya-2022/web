/**
 * Returns the largest prefix of `rawText` whose `encodeURIComponent()` result
 * is at most `maxEncodedLength` characters.
 *
 * Uses binary search over Unicode code points (not UTF-16 code units) so
 * emoji and other supplementary characters are never split mid-surrogate pair.
 *
 * Safe for arbitrary Unicode: the candidate is always re-encoded fresh,
 * never sliced from an already-encoded string.
 *
 * Example of the problem this solves: "à" encodes to "%C3%A0" (6 chars).
 * Slicing an already-encoded string can land mid-sequence and produce
 * malformed "%C3" partials that browsers reject. This function avoids
 * that entirely by working on raw code points.
 */
/** Conservative query-string budget for LLM chat URLs (ChatGPT, Claude). */
export const LLM_URL_QUERY_BUDGET = 8000;

export function truncateToEncodedLength(
  rawText: string,
  maxEncodedLength: number
): string {
  if (encodeURIComponent(rawText).length <= maxEncodedLength) return rawText;

  // Spread to code points so emoji (surrogate pairs) are treated as one unit
  const points = Array.from(rawText);
  let lo = 0;
  let hi = points.length;

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (encodeURIComponent(points.slice(0, mid).join("")).length <= maxEncodedLength) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return points.slice(0, lo).join("");
}
