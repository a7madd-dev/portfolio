"use client";

import { useEffect } from "react";

export function useKey(
  key: string | string[],
  handler: (event: KeyboardEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const keys = Array.isArray(key) ? key : [key];
    function onKeyDown(event: KeyboardEvent) {
      if (keys.includes(event.key)) handler(event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, enabled]);
}
