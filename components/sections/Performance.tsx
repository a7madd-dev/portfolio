"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Performance } from "@/types/performance";
import { fadeUp, stagger } from "@/styles/motion";
import StatCard from "./StatCard";

// Charts are client-only and dynamically imported so they don't inflate
// the initial bundle for viewers who never scroll this far.
const BarChart = dynamic(() => import("@/components/charts/BarChart"), {
  ssr: false,
  loading: () => <ChartSkeleton rows={6} />,
});
const DonutChart = dynamic(() => import("@/components/charts/DonutChart"), {
  ssr: false,
  loading: () => <ChartSkeleton rows={4} />,
});
const LineChart = dynamic(() => import("@/components/charts/LineChart"), {
  ssr: false,
  loading: () => <ChartSkeleton rows={3} />,
});

import ChartFrame from "@/components/charts/ChartFrame";

type Props = { data: Performance };

export default function PerformanceSection({ data }: Props) {
  const { stats, skills, categories, timeline } = data;
  return (
    <section id="insights" className="space-y-10 pb-24">
      <motion.header
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="relative flex items-end justify-between gap-8 border-t border-hairline pt-10"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-px left-0 h-px w-24 bg-gradient-to-r from-accent/50 to-transparent"
        />
        <motion.div variants={fadeUp} className="space-y-2">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
            <span className="tabular-nums text-ink-faint">/ 02</span>
            <span>Insights</span>
          </div>
          <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
            By the numbers
          </h2>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="hidden max-w-xs text-sm leading-relaxed text-ink-muted md:block"
        >
          A quick dashboard view — counts, skill mix, project shape, and
          delivery cadence over recent years.
        </motion.p>
      </motion.header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects completed"
          value={stats.projectsCompleted}
          suffix="+"
          delay={0}
        />
        <StatCard
          label="Years of experience"
          value={stats.yearsExperience}
          delay={0.08}
        />
        <StatCard label="Clients served" value={stats.clients} suffix="+" delay={0.16} />
        <StatCard
          label="Technologies used"
          value={stats.technologies}
          suffix="+"
          delay={0.24}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ChartFrame
            eyebrow="Skills"
            title="Distribution of proficiency"
            subtitle="Relative comfort across the stack, from daily tools to occasional collaborators."
          >
            <BarChart data={skills} />
          </ChartFrame>
        </div>
        <div className="lg:col-span-2">
          <ChartFrame
            eyebrow="Categories"
            title="Project shape"
            subtitle="What I tend to build — the split by product type."
          >
            <DonutChart data={categories} />
          </ChartFrame>
        </div>
        <div className="lg:col-span-5">
          <ChartFrame
            eyebrow="Timeline"
            title="Delivery cadence"
            subtitle="Projects shipped per year — a rough pulse of throughput."
          >
            <LineChart data={timeline} />
          </ChartFrame>
        </div>
      </div>
    </section>
  );
}

function ChartSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-full rounded-full bg-elevated/60"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  );
}
