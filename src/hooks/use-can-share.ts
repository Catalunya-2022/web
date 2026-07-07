"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function getSnapshot() {
  return typeof navigator.share === "function" && navigator.maxTouchPoints > 0;
}

function getServerSnapshot() {
  return false;
}

/** Returns true on mobile/touch devices with Web Share API support. */
export function useCanShare(): boolean {
  return useSyncExternalStore(noop, getSnapshot, getServerSnapshot);
}
