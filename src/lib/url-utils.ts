/** Conservative query-string budget for LLM chat URLs (ChatGPT, Claude). */
export const LLM_URL_QUERY_BUDGET = 8000;

/** Longest prefix of rawText whose encodeURIComponent() fits maxEncodedLength. Binary
 *  search over code points, re-encoding each candidate, so no surrogate pair or %-sequence is ever split. */
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
