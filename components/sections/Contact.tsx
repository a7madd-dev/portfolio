"use client";

import { motion } from "framer-motion";
import type { Contact } from "@/types/contact";
import { fadeUp, stagger } from "@/styles/motion";
import MagneticButton from "@/components/ui/MagneticButton";

type Props = { contact: Contact };

export default function Contact({ contact }: Props) {
  const email = contact.email.trim();
  const mailto = email ? `mailto:${email}` : undefined;

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
        <motion.p variants={fadeUp} className="max-w-xl text-base text-ink-muted">
          I take on a small number of engagements per quarter. Tell me about
          your product, your constraints and the timeline — I&rsquo;ll get back
          to you within two working days.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          {mailto && (
            <MagneticButton
              onClick={() => {
                window.location.href = mailto;
              }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-bg shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[box-shadow] duration-500 ease-smooth hover:shadow-glow"
            >
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
          )}

          {email && (
            <a
              href={mailto}
              className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors duration-500 ease-smooth hover:text-ink"
            >
              {email}
              <span
                aria-hidden
                className="text-ink-faint opacity-0 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-accent-soft"
              >
                →
              </span>
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
