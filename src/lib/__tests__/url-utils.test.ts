import { describe, it, expect } from "vitest";
import { truncateToEncodedLength } from "../url-utils";

describe("truncateToEncodedLength", () => {
  it("returns short ASCII unchanged", () => {
    expect(truncateToEncodedLength("hello", 100)).toBe("hello");
  });

  it("returns full text when encoded length exactly equals budget", () => {
    const input = "abc"; // encodes to "abc" — 3 chars
    expect(truncateToEncodedLength(input, 3)).toBe("abc");
  });

  it("truncates long ASCII to fit within budget", () => {
    const input = "a".repeat(200);
    const result = truncateToEncodedLength(input, 100);
    expect(encodeURIComponent(result).length).toBeLessThanOrEqual(100);
    expect(result.length).toBe(100); // ASCII is 1:1
  });

  it("handles accented Catalan text without malformed sequences", () => {
    // Each accented char like "à" encodes to 6 chars (%C3%A0)
    const input = "Àrea d'actuació prioritària amb è, í, ò, ú i ç";
    const result = truncateToEncodedLength(input, 30);
    expect(encodeURIComponent(result).length).toBeLessThanOrEqual(30);
    // Result must be decodable (no partial multibyte sequences)
    expect(() => decodeURIComponent(encodeURIComponent(result))).not.toThrow();
    expect(decodeURIComponent(encodeURIComponent(result))).toBe(result);
  });

  it("handles Spanish accented text correctly", () => {
    const input = "Acción para mejorar la situación económica española";
    const result = truncateToEncodedLength(input, 40);
    expect(encodeURIComponent(result).length).toBeLessThanOrEqual(40);
    expect(() => decodeURIComponent(encodeURIComponent(result))).not.toThrow();
  });

  it("handles multibyte emoji without partial sequences", () => {
    // Each emoji like 🎉 encodes to 12 chars (%F0%9F%8E%89)
    const input = "Test 🎉🎊🎈 end";
    const result = truncateToEncodedLength(input, 20);
    expect(encodeURIComponent(result).length).toBeLessThanOrEqual(20);
    expect(() => decodeURIComponent(encodeURIComponent(result))).not.toThrow();
  });

  it("returns empty string when even one char exceeds budget", () => {
    const input = "à"; // encodes to 6 chars (%C3%A0)
    expect(truncateToEncodedLength(input, 5)).toBe("");
  });

  it("is lossless for text well within budget", () => {
    const input = "Catalunya 2022: RESET — Àrea d'actuació";
    expect(truncateToEncodedLength(input, 10000)).toBe(input);
  });

  it("produces the maximum possible length under budget", () => {
    const input = "àà".repeat(100); // each "àà" encodes to 12 chars
    const budget = 60; // fits exactly 5 "àà" = 10 chars raw, 60 encoded
    const result = truncateToEncodedLength(input, budget);
    expect(encodeURIComponent(result).length).toBeLessThanOrEqual(budget);
    // The next character would exceed the budget
    const oneMore = result + "à";
    expect(encodeURIComponent(oneMore).length).toBeGreaterThan(budget);
  });
});
