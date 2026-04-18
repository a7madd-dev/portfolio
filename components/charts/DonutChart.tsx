"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import type { CategoryDatum } from "@/types/performance";

type Props = {
  data: CategoryDatum[];
};

const PALETTE = ["#7C5CFF", "#5EEAD4", "#F6C177", "#F472B6", "#60A5FA", "#C084FC"];

// Donut chart — built with a single SVG circle per segment using
// stroke-dasharray. Each segment animates its offset inward from 0 so the
// "draw" reads as a continuous sweep rather than multiple segments popping in.
export default function DonutChart({ data }: Props) {
  const gradientPrefix = useId().replace(/:/g, "");

  const total = data.reduce((acc, d) => acc + d.value, 0);
  if (total <= 0) {
    return <p className="text-sm text-ink-faint">No category data yet.</p>;
  }

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const gap = 4; // visual gap between segments

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const color = d.color ?? PALETTE[i % PALETTE.length];
    const fraction = d.value / total;
    const length = Math.max(0, circumference * fraction - gap);
    const offset = -(cumulative * circumference);
    cumulative += fraction;
    return { ...d, color, length, offset };
  });

  return (
    <div className="grid items-center gap-8 md:grid-cols-[170px_1fr]">
      <div className="relative mx-auto h-[170px] w-[170px]">
        <svg
          viewBox="0 0 170 170"
          className="h-full w-full -rotate-90"
          aria-hidden
        >
          <defs>
            {segments.map((s, i) => (
              <linearGradient
                key={i}
                id={`${gradientPrefix}-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="1" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.65" />
              </linearGradient>
            ))}
          </defs>
          {/* Track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
          />
          {segments.map((s, i) => (
            <motion.circle
              key={i}
              cx="85"
              cy="85"
              r={radius}
              fill="none"
              stroke={`url(#${gradientPrefix}-${i})`}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${s.length} ${circumference}`}
              initial={{ strokeDashoffset: s.offset + circumference }}
              whileInView={{ strokeDashoffset: s.offset }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 1.1,
                delay: 0.12 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                filter: `drop-shadow(0 0 10px ${s.color}55)`,
              }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">
            Total
          </span>
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl font-semibold tracking-tight text-ink"
          >
            {total}
          </motion.span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {segments.map((s, i) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li
              key={`${s.label}-${i}`}
              className="flex items-center gap-3 text-[13px]"
            >
              <span
                aria-hidden
                className="inline-block h-2 w-2 flex-none rounded-full"
                style={{
                  background: s.color,
                  boxShadow: `0 0 10px ${s.color}88`,
                }}
              />
              <span className="flex-1 truncate text-ink">{s.label}</span>
              <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                {s.value}
                <span className="ml-1 text-ink-faint">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
