// Safe at module scope: .replace() always resets lastIndex to 0 after completion
const DIACRITICS_RE = /[\u0300-\u036f]/g;

/** Accent-strip without trimming: preserves 1:1 offsets for NFC text. */
export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase();
}

/** Normalize text for accent-insensitive search matching. */
export function normalizeForSearch(value: string): string {
  return stripDiacritics(value).trim();
}
