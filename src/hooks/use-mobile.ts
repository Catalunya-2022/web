"use client";

import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const mql = typeof window !== "undefined" ? window.matchMedia(QUERY) : null;

function subscribe(callback: () => void) {
  mql!.addEventListener("change", callback);
  return () => mql!.removeEventListener("change", callback);
}

function getSnapshot() {
  return mql!.matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
