"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/styles/motion";

const principles = [
  {
    title: "Taste",
    body: "Spacing, typography, motion. Get these right and the product feels premium before a user reads a single line of copy.",
  },
  {
    title: "Performance",
    body: "Measured before it ships. Fast on a mid-range Android on a slow 4G connection, not just in a Lighthouse run.",
  },
  {
    title: "Craft",
    body: "The interface is a surface, not a truth. Underneath is a typed, tested, well-named system that the next engineer can reason about.",
  },
];

export default function About() {
  return (
    <section id="about" className="space-y-12 border-t border-hairline py-24">
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20% 0px" }}
        className="space-y-8"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim"
        >
          About
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="max-w-3xl text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-ink"
        >
          I help teams ship products that stand out — not by adding more, but by
          removing what doesn&rsquo;t belong.
        </motion.h2>
      </motion.div>

      <motion.ul
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20% 0px" }}
        className="grid gap-6 md:grid-cols-3"
      >
        {principles.map((p, i) => (
          <motion.li
            key={p.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-xl border border-hairline bg-surface/60 p-6 shadow-soft transition-[border-color,transform,box-shadow] duration-700 ease-smooth hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-card"
          >
            {/* Inner top highlight — gives the card an elevated glass feel. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.04] to-transparent"
            />

            <div className="relative flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent-soft">
                {p.title}
              </div>
              <div className="font-mono text-[10px] tabular-nums text-ink-faint">
                0{i + 1}
              </div>
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-ink-muted">
              {p.body}
            </p>

            {/* Accent top-edge — blooms on hover. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
            />
            {/* Corner tint — subtle color wash from the top-right on hover. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-700 ease-smooth [background:radial-gradient(circle,rgba(124,92,255,0.22),transparent_70%)] group-hover:opacity-100"
            />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
