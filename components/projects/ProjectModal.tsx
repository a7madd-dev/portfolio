"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import type { Project } from "@/types/project";
import { spring } from "@/styles/motion";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { useKey } from "@/lib/useKey";
import ProjectGallery from "./ProjectGallery";

type Props = {
  project: Project;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  useLockBodyScroll(true);
  useKey("Escape", onClose);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Move focus into the dialog for keyboard users. Delay one frame so the
    // shared-element transition has started and scroll position is stable.
    const id = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  // Parallax: track pointer across the modal, offset the gallery subtly.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 70, damping: 22 });
  const smy = useSpring(my, { stiffness: 70, damping: 22 });
  const parallaxX = useTransform(smx, [-0.5, 0.5], [10, -10]);
  const parallaxY = useTransform(smy, [-0.5, 0.5], [8, -8]);

  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const r = event.currentTarget.getBoundingClientRect();
      mx.set((event.clientX - r.left) / r.width - 0.5);
      my.set((event.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );

  const accent = project.accent ?? "#7C5CFF";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-overlay backdrop-blur-xl md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${project.slug}`}
      style={{
        // Tint the backdrop with the project's accent — ties the modal to the card.
        backgroundImage: `radial-gradient(80% 60% at 50% 40%, ${accent}14, transparent 70%)`,
      }}
    >
      <motion.div
        layoutId={`card-${project.slug}`}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMove}
        className="relative my-8 w-[min(1100px,92vw)] overflow-hidden rounded-2xl border border-hairline-strong bg-surface shadow-elevated md:my-16"
        style={{
          backgroundImage: `linear-gradient(180deg, ${accent}18, transparent 35%), linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))`,
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="group absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong bg-bg/70 text-ink-muted backdrop-blur-md transition-[border-color,color,box-shadow,transform] duration-500 ease-smooth hover:-rotate-90 hover:border-accent/50 hover:text-ink hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <motion.div
          layoutId={`cover-${project.slug}`}
          className="relative overflow-hidden"
        >
          <motion.div
            style={{ x: parallaxX, y: parallaxY, scale: 1.05 }}
            className="origin-center"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 1100px"
                placeholder="blur"
                blurDataURL={project.cover.blurDataURL}
                className="object-cover"
              />
              {/* Bottom-up fade deepens the seam to the meta row. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              {/* Accent wash layered over the cover for tonal cohesion. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{
                  background: `radial-gradient(70% 50% at 50% 100%, ${accent}2e, transparent 70%)`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="relative px-8 pb-12 pt-8 md:px-14 md:pb-16">
          <motion.div
            layoutId={`meta-${project.slug}`}
            className="mb-10 flex flex-wrap items-end justify-between gap-6"
          >
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                <span>{project.year}</span>
                <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
                <span>{project.role}</span>
              </div>
              <h2
                id={`dialog-title-${project.slug}`}
                className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em]"
              >
                {project.title}
              </h2>
              <p className="max-w-xl text-ink-muted">{project.tagline}</p>
            </div>

            {project.links && project.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-2"
              >
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-elevated/60 px-4 py-2 text-xs text-ink-muted backdrop-blur-sm transition-[color,border-color,background,box-shadow] duration-500 ease-smooth hover:border-accent/50 hover:bg-elevated hover:text-ink hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  >
                    {link.label}
                    <span className="transition-transform duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <ProjectGallery images={project.gallery} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 md:grid-cols-[1.6fr_1fr]"
          >
            <div className="space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                Overview
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-muted">
                {project.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                Stack
              </h3>
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-hairline bg-elevated/70 px-3 py-1 text-xs text-ink-muted transition-colors duration-500 ease-smooth hover:border-hairline-strong hover:text-ink"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
