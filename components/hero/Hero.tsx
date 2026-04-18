"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/styles/motion";

export default function Hero() {
  return (
    <section
      id="intro"
      className="relative flex min-h-[68vh] items-end pb-20 pt-24 md:min-h-[78vh] md:pt-32"
    >
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-ink-dim"
        >
          <span aria-hidden className="h-px w-8 bg-hairline-strong" />
          Selected work, 2024—2026
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="max-w-[18ch] text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
        >
          Crafting digital products that feel{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span className="bg-gradient-to-br from-accent-soft via-accent to-accent-deep bg-clip-text text-transparent">
              inevitable
            </span>
            {/* Underline swash — thicker, left-to-right gradient, sits below baseline. */}
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-[0.12em] block h-[2px] bg-gradient-to-r from-accent-soft/10 via-accent to-accent-deep/20 opacity-90"
            />
          </span>
          .
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="max-w-xl text-base leading-relaxed text-ink-muted md:text-[17px]"
        >
          I partner with founders and product teams to design and ship
          high-performance web applications — from identity systems and
          interaction design to the infrastructure beneath them.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-6 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim"
        >
          <Stat label="Shipped" value="40+" note="products" />
          <Divider />
          <Stat label="Focus" value="Web" note="product & platform" />
          <Divider />
          <Stat label="Based in" value="Remote" note="GMT+2" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-ink-dim">{label}</span>
      <span className="font-sans text-sm normal-case tracking-normal text-ink">
        {value}
      </span>
      <span className="text-ink-faint">{note}</span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="h-3 w-px bg-hairline" />;
}
