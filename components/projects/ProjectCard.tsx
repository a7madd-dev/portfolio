"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";
import TiltCard from "@/components/ui/TiltCard";
import { spring } from "@/styles/motion";

type Props = {
  project: Project;
  onOpen: () => void;
  index: number;
};

export default function ProjectCard({ project, onOpen, index }: Props) {
  const accent = project.accent ?? "#7C5CFF";

  return (
    <motion.article
      layoutId={`card-${project.slug}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...spring, delay: index * 0.08 }}
      className="group relative"
    >
      <TiltCard
        max={4}
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-hairline bg-surface/80 shadow-soft backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-700 ease-smooth group-hover:-translate-y-0.5 group-hover:border-hairline-strong group-hover:shadow-card"
      >
        {/* Inner highlight — the top edge catches the "light" so cards feel elevated. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        />
        {/* Accent seam reveal on hover — hairline of project color. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
          }}
        />

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left focus:outline-none"
          aria-label={`Open ${project.title} case study`}
        >
          <motion.div
            layoutId={`cover-${project.slug}`}
            className="relative aspect-[16/10] overflow-hidden"
          >
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px"
              placeholder="blur"
              blurDataURL={project.cover.blurDataURL}
              className="object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.06]"
            />
            {/* Base darkening so metadata below reads against rich covers. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/15 to-transparent" />
            {/* Accent wash from the bottom — blooms on hover. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-smooth group-hover:opacity-100"
              style={{
                background: `radial-gradient(60% 60% at 50% 100%, ${accent}3d, transparent 70%)`,
              }}
            />
            {/* Subtle inner vignette — corners darken, pulls focus to the image center. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_100%_at_50%_50%,transparent_60%,rgba(0,0,0,0.25)_100%)]"
            />
          </motion.div>

          <motion.div
            layoutId={`meta-${project.slug}`}
            className="flex items-start justify-between gap-4 p-6"
          >
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                <span>{project.year}</span>
                <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
                <span className="truncate">{project.role}</span>
              </div>
              <h3 className="truncate text-lg font-medium tracking-tight text-ink transition-colors duration-500 ease-smooth">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
                {project.tagline}
              </p>
            </div>
            <span
              aria-hidden
              className="mt-1 inline-flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-full border border-hairline-strong bg-elevated/40 text-ink-muted transition-[border-color,color,background,transform] duration-500 ease-smooth group-hover:border-accent/60 group-hover:bg-elevated group-hover:text-ink"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 18px rgba(0,0,0,0.4)",
              }}
            >
              {/* Two arrows stacked — swap on hover for a restrained "sent" affordance. */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-transform duration-500 ease-smooth group-hover:translate-x-3 group-hover:-translate-y-3"
              >
                <path
                  d="M3 9L9 3M9 3H4M9 3V8"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="absolute -translate-x-3 translate-y-3 transition-transform duration-500 ease-smooth group-hover:translate-x-0 group-hover:translate-y-0"
              >
                <path
                  d="M3 9L9 3M9 3H4M9 3V8"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.div>
        </button>
      </TiltCard>
    </motion.article>
  );
}
