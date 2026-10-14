import { Inter, Outfit } from "next/font/google";

// Shared by the locale layout and the root not-found boundary, which renders
// its own <html> outside that layout. Latin subset only: the content has zero
// latin-ext code points (verified 2026-10-13).
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});
