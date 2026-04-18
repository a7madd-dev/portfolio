"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

// Shared container for the chart tiles — provides the premium card chrome
// (hairline border, inner highlight, accent seam reveal on hover) so the
// chart contents can stay purely about the data.
export default function ChartFrame({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-hairline bg-surface/70 p-6 shadow-soft backdrop-blur-sm transition-[border-color,box-shadow] duration-700 ease-smooth hover:border-hairline-strong hover:shadow-card md:p-7 ${className ?? ""}`}
    >
      {/* Top accent seam — reveals on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
      />

      <header className="mb-6 space-y-1.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          <span className="inline-block h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(124,92,255,0.6)]" />
          {eyebrow}
        </div>
        <h3 className="text-base font-medium tracking-tight text-ink">{title}</h3>
        {subtitle && (
          <p className="text-[12.5px] leading-relaxed text-ink-muted">{subtitle}</p>
        )}
      </header>

      {children}
    </motion.section>
  );
}
