"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/styles/motion";
import SideNav from "./SideNav";
import SocialLinks from "./SocialLinks";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * The sticky identity panel — always visible on desktop.
 * On mobile (below md) this becomes a stacked header via the page layout.
 *
 * The animated gradient underneath uses background-position drift rather
 * than compositor-expensive blur animation — cheap on the GPU.
 */
export default function SidePanel() {
  return (
    <aside className="noise-overlay relative flex h-full flex-col justify-between overflow-hidden">
      <AmbientGradient />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12 lg:p-14"
      >
        <div className="space-y-12">
          <motion.div variants={fadeUp} className="space-y-2.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
              Portfolio ’26
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-elevated/40 px-2.5 py-1 text-[11px] tracking-wide text-ink-muted backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
              </span>
              Available for select work
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-5">
            <h1 className="text-[clamp(2.25rem,3.6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
              Ahmad
              <br />
              Yousef
            </h1>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              <span className="h-px w-8 bg-gradient-to-r from-accent-soft/60 to-transparent" />
              <span>Fullstack · Design engineer</span>
            </div>
            <p className="max-w-sm text-[13.5px] leading-[1.65] text-ink-muted">
              I craft premium, high-performance products at the intersection of
              design and engineering — typed, tested, and tuned to feel fast.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <SideNav />
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="space-y-7">
          <MagneticButton
            onClick={() => {
              const el = document.getElementById("contact");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group relative inline-flex items-center gap-3 rounded-full border border-hairline-strong bg-elevated/60 px-5 py-3 text-sm text-ink backdrop-blur-md transition-[border-color,background,box-shadow] duration-500 ease-smooth hover:border-accent/50 hover:bg-elevated hover:shadow-[0_10px_30px_rgba(124,92,255,0.18)]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-0 blur-[6px] transition-opacity duration-500 ease-smooth group-hover:opacity-90" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Start a project
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          <SocialLinks />
        </motion.div>
      </motion.div>
    </aside>
  );
}

function AmbientGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* base vignette — layered gradient with a warmer midtone */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(124,92,255,0.08),transparent_55%),linear-gradient(160deg,var(--color-surface)_0%,var(--color-bg)_45%,var(--color-bg)_100%)]" />
      {/* slow drifting color wash — two blobs, mixed for richness */}
      <div className="animate-ambient absolute -inset-40 opacity-70 mix-blend-screen blur-3xl [background:radial-gradient(42%_42%_at_28%_18%,rgba(124,92,255,0.42),transparent_62%),radial-gradient(46%_46%_at_78%_72%,rgba(94,234,212,0.16),transparent_60%),radial-gradient(30%_30%_at_60%_40%,rgba(246,193,119,0.08),transparent_60%)]" />
      {/* top-left inner highlight */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.035] to-transparent" />
      {/* bottom fade to deepen the footer area */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg/80 to-transparent" />
      {/* hairline on the right edge, subtle depth cue against scrolling content */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-hairline-strong to-transparent" />
    </div>
  );
}
