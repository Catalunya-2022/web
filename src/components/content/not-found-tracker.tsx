"use client";

import { useEffect } from "react";

const LOCALHOST_RE = /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/;

/**
 * Reports a "404" event straight to the Plausible events API: the root
 * not-found boundary renders without the analytics script, so window.plausible
 * is not available there. Mirrors the script's own guards (localhost,
 * automation, plausible_ignore self-exclusion).
 */
export function NotFoundTracker() {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return;
    if (LOCALHOST_RE.test(location.hostname) || location.protocol === "file:") return;
    if (navigator.webdriver) return;
    try {
      if (localStorage.plausible_ignore === "true") return;
    } catch {
      /* storage disabled: fall through and report */
    }
    fetch("/reset/event", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      keepalive: true,
      body: JSON.stringify({ name: "404", url: location.href, domain }),
    }).catch(() => {
      /* silent */
    });
  }, []);

  return null;
}
