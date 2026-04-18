"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/styles/motion";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative space-y-10 border-t border-hairline py-24"
    >
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="space-y-8"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim"
        >
          Contact
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="max-w-[16ch] text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
        >
          Have something you&rsquo;d like to build?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="max-w-xl text-base text-ink-muted"
        >
          I take on a small number of engagements per quarter. Tell me about
          your product, your constraints and the timeline — I&rsquo;ll get back
          to you within two working days.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
          <MagneticButton
            onClick={() => {
              window.location.href = "mailto:a7madd5111@gmail.com";
            }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[box-shadow] duration-500 ease-smooth hover:shadow-glow"
          >
            {/* Subtle sheen — a diagonal highlight sweeps across on hover. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-smooth group-hover:translate-x-full"
            />
            <span className="relative">Write to me</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden
              className="relative transition-transform duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          <a
            href="mailto:a7madd5111@gmail.com"
            className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors duration-500 ease-smooth hover:text-ink"
          >
            a7madd5111@gmail.com
            <span
              aria-hidden
              className="text-ink-faint opacity-0 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-accent-soft"
            >
              →
            </span>
          </a>
        </motion.div>
      </motion.div>

      <footer className="flex flex-wrap items-center justify-between gap-4 pt-16 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        <span>© {new Date().getFullYear()} Ahmad Yousef</span>
        <span className="tracking-[0.16em]">Built with Next.js · Framer Motion</span>
      </footer>
    </section>
  );
}
