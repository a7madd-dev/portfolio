"use client";

import { motion } from "framer-motion";
import type { SkillDatum } from "@/types/performance";

type Props = {
  data: SkillDatum[];
};

// Horizontal bar chart — one row per item. Animates width in on first view.
// Deliberately minimal: no axes, no gridlines. Value lives in the chip at
// the end of the bar so the eye reads label → bar → number.
export default function BarChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-ink-faint">No skills defined yet.</p>
    );
  }

  const max = Math.max(100, ...data.map((d) => d.value));

  return (
    <div className="space-y-3.5">
      {data.map((item, i) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={`${item.label}-${i}`} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-4 text-[12.5px]">
              <span className="truncate text-ink">{item.label}</span>
              <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                {Math.round(item.value)}
              </span>
            </div>
            <div className="relative h-[6px] overflow-hidden rounded-full bg-elevated/80">
              {/* Subtle groove — inset shadow so bars don't float on a flat bar. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 1.1,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(124,92,255,0.9), rgba(167,139,250,0.95))",
                  boxShadow:
                    "0 0 12px rgba(124,92,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                {/* Specular highlight traveling the bar on hover of the row */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
                />
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
