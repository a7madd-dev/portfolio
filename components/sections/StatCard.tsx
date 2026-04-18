"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
};

// Stat card — number counts up as it enters view. Hover reveals an accent
// glow and a subtle lift. Shares the tile aesthetic with project cards.
export default function StatCard({ label, value, suffix = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 22, mass: 0.9 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => mv.set(value), delay * 1000);
      return () => clearTimeout(t);
    }
  }, [inView, mv, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface/70 p-5 shadow-soft backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-700 ease-smooth hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-card"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100 [background:radial-gradient(60%_80%_at_50%_0%,rgba(124,92,255,0.14),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
        {label}
      </p>
      <div className="mt-3 flex items-baseline gap-0.5">
        <motion.span className="text-[clamp(1.8rem,3vw,2.25rem)] font-semibold tabular-nums tracking-[-0.02em] text-ink">
          {display}
        </motion.span>
        {suffix && (
          <span className="text-lg font-semibold text-accent-soft">{suffix}</span>
        )}
      </div>
    </motion.div>
  );
}
