"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees at a card corner. */
  max?: number;
};

/**
 * 3D tilt that follows the cursor, plus a lighting gradient that tracks
 * the mouse position inside the card. Both values are spring-smoothed so the
 * effect feels like parallax glass rather than a JS-driven transform.
 *
 * Tuning notes:
 * - Lower stiffness + higher damping → damped, luxurious settle (no jitter).
 * - Two lighting layers: a soft ambient highlight (soft-light blend) and a
 *   tighter specular core (screen blend). Together they read as glass catching
 *   a light source rather than a flat mask.
 */
export default function TiltCard({ children, className = "", max = 5 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(true);

  // -0.5 .. 0.5 normalized pointer position inside the card
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Pointer position as 0-100% — drives the lighting gradient overlay
  const lx = useMotionValue(50);
  const ly = useMotionValue(50);

  const rotateY = useTransform(px, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(py, [-0.5, 0.5], [max, -max]);

  // Softer springs — damped settle, no visible wobble on leave.
  const sRotateX = useSpring(rotateX, { stiffness: 160, damping: 26, mass: 0.7 });
  const sRotateY = useSpring(rotateY, { stiffness: 160, damping: 26, mass: 0.7 });
  const sLx = useSpring(lx, { stiffness: 160, damping: 28 });
  const sLy = useSpring(ly, { stiffness: 160, damping: 28 });

  useEffect(() => {
    // Tilt requires a precise pointer. Skip entirely on touch to avoid the
    // "sticky tilt" that happens when a tap leaves the card rotated.
    const hoverOk = window.matchMedia("(hover: hover)").matches;
    const fineOk = window.matchMedia("(pointer: fine)").matches;
    setEnabled(hoverOk && fineOk);
  }, []);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (event.clientX - r.left) / r.width;
    const ny = (event.clientY - r.top) / r.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    lx.set(nx * 100);
    ly.set(ny * 100);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
    lx.set(50);
    ly.set(50);
  }

  // Soft ambient highlight — broad, low-opacity; blends with surface color.
  const softLight = useTransform(
    [sLx, sLy],
    ([x, y]) =>
      `radial-gradient(540px circle at ${x}% ${y}%, rgba(255,255,255,0.14), transparent 55%)`,
  );
  // Tight specular — smaller, brighter core for that "glass catching a light" feel.
  const specular = useTransform(
    [sLx, sLy],
    ([x, y]) =>
      `radial-gradient(140px circle at ${x}% ${y}%, rgba(255,255,255,0.22), transparent 65%)`,
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: enabled ? sRotateX : 0,
        rotateY: enabled ? sRotateY : 0,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      {children}
      {/* Soft ambient highlight — low contrast, large footprint. */}
      <motion.div
        aria-hidden
        style={{ background: softLight }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
      />
      {/* Specular — tight, bright core that moves with the pointer. */}
      <motion.div
        aria-hidden
        style={{ background: specular }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-screen"
      />
    </motion.div>
  );
}
