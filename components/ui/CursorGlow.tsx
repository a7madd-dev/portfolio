"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Ambient glow that trails the cursor. Spring-smoothed so movement has
 * inertia — a fixed div with a background gradient positioned by motion values.
 *
 * Only mounted on fine-pointer, hover-capable environments where an ambient
 * cursor glow actually reads as the cursor. CSS also enforces this via the
 * `.cursor-glow` class (media-query-guarded in globals.css).
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  // Softer spring — less reactive, more ambient. Follow cursor with drift.
  const sx = useSpring(x, { stiffness: 45, damping: 22, mass: 1 });
  const sy = useSpring(y, { stiffness: 45, damping: 22, mass: 1 });

  useEffect(() => {
    // Gate on capability: no touch, has fine pointer, no reduced-motion.
    const hoverOk = window.matchMedia("(hover: hover)").matches;
    const fineOk = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hoverOk || !fineOk || reduced) return;
    setEnabled(true);

    // Start near the viewport center so the first pointer move doesn't jolt.
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 2);

    function onMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  // Softer + smaller radius. Two-layer: soft ambient wash + tighter core.
  const background = useTransform(
    [sx, sy],
    ([vx, vy]) =>
      `radial-gradient(480px circle at ${vx}px ${vy}px, rgba(124,92,255,0.09), transparent 60%),` +
      `radial-gradient(160px circle at ${vx}px ${vy}px, rgba(167,139,250,0.06), transparent 70%)`,
  );

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ background }}
      className="cursor-glow pointer-events-none fixed inset-0 z-0"
    />
  );
}
