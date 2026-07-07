/**
 * Shared OG image template for next/og (Satori).
 *
 * Satori constraints:
 * - Flexbox only (no CSS Grid)
 * - No JSX comments inside JSX
 * - No objectFit on img
 * - No CSS variables
 * - fonts must be ArrayBuffer
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import { uiStrings } from "@/lib/ui-strings";

/** Standard OG image dimensions. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

let fontCache: ArrayBuffer | null = null;

export async function getFontData(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const buf = await readFile(
    path.join(process.cwd(), "public/fonts/Outfit-Bold.ttf")
  );
  fontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return fontCache;
}

function titleFontSize(title: string): number {
  if (title.length < 25) return 88;
  if (title.length < 40) return 74;
  if (title.length < 60) return 62;
  if (title.length < 90) return 52;
  return 42;
}

function subtitleFontSize(text: string): number {
  if (text.length < 50) return 36;
  if (text.length < 100) return 28;
  return 24;
}

export type OGImageProps = {
  label?: string;
  heading?: string;
  title: string;
  subtitle?: string;
  locale: Locale;
  photoSrc?: string;
  variant?: "default" | "home";
};

export function OGTemplate({
  label,
  heading,
  title,
  subtitle,
  locale,
  photoSrc,
  variant = "default",
}: OGImageProps): ReactElement {
  const fontSize = titleFontSize(title);
  const tagline = uiStrings[locale].ogTagline;
  const trimmedSubtitle =
    subtitle && subtitle.length > 140
      ? subtitle.slice(0, 140) + "\u2026"
      : subtitle;

  if (variant === "home") {
    const resetFontSize = tagline.length > 30 ? 64 : 72;
    const taglineFontSize = tagline.length > 30 ? 52 : 60;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
        }}
      >
        <div style={{ height: 10, background: "#BF1523", flexShrink: 0 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "0 80px 56px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Outfit",
                fontSize: 26,
                fontWeight: 700,
                color: "#252226",
                letterSpacing: 1,
              }}
            >
              Catalunya 2022
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "Outfit",
                  fontSize: resetFontSize,
                  fontWeight: 700,
                  color: "#252226",
                  letterSpacing: -2,
                  lineHeight: 1,
                }}
              >
                {"RESET: "}
              </span>
              <span
                style={{
                  fontFamily: "Outfit",
                  fontSize: taglineFontSize,
                  fontWeight: 700,
                  color: "#BF1523",
                  lineHeight: 1,
                }}
              >
                {tagline}
              </span>
            </div>

            {trimmedSubtitle && (
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#6B6769",
                  lineHeight: 1.4,
                  marginTop: 24,
                }}
              >
                {trimmedSubtitle}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 80px 40px",
          }}
        >
          <span
            style={{
              fontFamily: "Outfit",
              fontSize: 48,
              fontWeight: 700,
              color: "#BF1523",
            }}
          >
            2022.cat
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
      }}
    >
      <div style={{ height: 10, background: "#BF1523", flexShrink: 0 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "44px 80px 56px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Outfit",
              fontSize: 24,
              fontWeight: 700,
              color: "#252226",
            }}
          >
            Catalunya 2022
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontFamily: "Outfit",
                fontSize: 60,
                fontWeight: 700,
                color: "#252226",
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              {"RESET: "}
            </span>
            <span
              style={{
                fontFamily: "Outfit",
                fontSize: 50,
                fontWeight: 700,
                color: "#BF1523",
                lineHeight: 1,
              }}
            >
              {tagline}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {photoSrc ? (
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div
                style={{
                  width: 180,
                  height: 228,
                  borderRadius: 9999,
                  overflow: "hidden",
                  display: "flex",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Satori requires HTML img */}
                <img src={photoSrc} alt="" width={180} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: fontSize,
                    fontWeight: 700,
                    color: "#252226",
                    lineHeight: 1.1,
                    letterSpacing: -1,
                  }}
                >
                  {title}
                </div>
                {trimmedSubtitle && (
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#6B6769",
                      lineHeight: 1.4,
                      marginTop: 12,
                    }}
                  >
                    {trimmedSubtitle}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {heading && (
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: 58,
                    fontWeight: 700,
                    color: "#252226",
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}
                >
                  {heading}
                </div>
              )}
              {label && (
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#BF1523",
                    letterSpacing: 2,
                    marginTop: 8,
                    marginBottom: 12,
                  }}
                >
                  {label.toUpperCase()}
                </div>
              )}
              <div
                style={{
                  fontFamily: "Outfit",
                  fontSize,
                  fontWeight: 700,
                  color: heading ? "#6B6769" : "#252226",
                  lineHeight: 1.1,
                  letterSpacing: -1,
                }}
              >
                {title}
              </div>
              {trimmedSubtitle && (
                <div
                  style={{
                    fontFamily: "Outfit",
                    fontSize: subtitleFontSize(trimmedSubtitle),
                    fontWeight: 700,
                    color: "#6B6769",
                    lineHeight: 1.4,
                    marginTop: 16,
                  }}
                >
                  {trimmedSubtitle}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: "Outfit",
              fontSize: 42,
              fontWeight: 700,
              color: "#BF1523",
            }}
          >
            2022.cat
          </span>
        </div>
      </div>
    </div>
  );
}
