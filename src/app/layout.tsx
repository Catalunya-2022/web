import type { Metadata } from "next";
import { BASE_URL } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Catalunya 2022",
    template: "%s",
  },
  description:
    "A plan to reactivate Catalonia across society, economy, and public sector — 3 spheres, 12 goals, 91 actions.",
  icons: {
    // app/favicon.ico is auto-declared by the file convention, but a manual
    // `icon` list suppresses the app/icon.svg link — so declare the SVG here.
    // Explicit PNG sizes cover browsers without SVG favicon support.
    icon: [
      { url: "/icons/icon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    // apple-touch-icon.png lives in public/, nothing auto-declares it.
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
