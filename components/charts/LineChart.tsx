"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";
import type { TimelineDatum } from "@/types/performance";

type Props = {
  data: TimelineDatum[];
};

// Smooth line chart — a monotonic cubic spline through the points so the
// curve reads organic rather than polygonal. The stroke animates in via
// pathLength; the area fill fades in just behind it.
export default function LineChart({ data }: Props) {
  const gid = useId().replace(/:/g, "");

  const width = 560;
  const height = 180;
  const padX = 24;
  const padY = 22;

  const geometry = useMemo(() => {
    if (data.length === 0) return null;
    const max = Math.max(...data.map((d) => d.value), 1);
    const min = Math.min(...data.map((d) => d.value), 0);
    const range = max - min || 1;

    const stepX =
      data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;

    const points = data.map((d, i) => ({
      x: padX + stepX * i,
      y: padY + (1 - (d.value - min) / range) * (height - padY * 2),
      raw: d,
    }));

    return { points, stepX, max, min };
  }, [data]);

  if (!geometry) {
    return <p className="text-sm text-ink-faint">No timeline data yet.</p>;
  }
  const { points } = geometry;

  // Catmull-Rom → Bézier for smooth, monotonic curves.
  const curvePath = toSmoothPath(points.map(({ x, y }) => ({ x, y })));
  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${gid}-stroke`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="100%" stopColor="#5EEAD4" />
            </linearGradient>
            <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal ghost gridlines — barely there, just grounding. */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={padX}
              x2={width - padX}
              y1={padY + t * (height - padY * 2)}
              y2={padY + t * (height - padY * 2)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Area under curve — reveals after the stroke draws. */}
          <motion.path
            d={areaPath}
            fill={`url(#${gid}-fill)`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.path
            d={curvePath}
            fill="none"
            stroke={`url(#${gid}-stroke)`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              filter: "drop-shadow(0 3px 10px rgba(124,92,255,0.35))",
            }}
          />

          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                delay: 0.9 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r="4.5" fill="#0a0a0b" />
              <circle
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#f5f5f6"
                style={{ filter: "drop-shadow(0 0 6px rgba(124,92,255,0.6))" }}
              />
            </motion.g>
          ))}
        </svg>
      </div>

      <div
        className="grid text-[11px] tabular-nums text-ink-faint"
        style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
      >
        {points.map((p, i) => (
          <div key={i} className="text-center">
            <div className="font-mono uppercase tracking-[0.18em]">
              {p.raw.label}
            </div>
            <div className="text-ink-muted">{p.raw.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Converts a list of points into a smooth SVG path using Catmull-Rom → Bézier.
function toSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  const tension = 0.5;
  const d: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}
