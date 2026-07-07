// Safe at module scope: .replace() always resets lastIndex to 0 after completion
const DIACRITICS_RE = /[\u0300-\u036f]/g;

/** Normalize text for accent-insensitive search matching. */
export function normalizeForSearch(value: string): string {
  return value.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase().trim();
}
