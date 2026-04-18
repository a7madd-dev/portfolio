"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type Props = {
  projects: Project[];
};

export default function ProjectGrid({ projects }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = projects.find((p) => p.slug === activeSlug) ?? null;

  return (
    <LayoutGroup>
      <section id="work" className="space-y-12 pb-24">
        <header className="relative flex items-end justify-between gap-8 border-t border-hairline pt-10">
          {/* Accent spark on the top rule — ties the section to the brand color. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-px left-0 h-px w-24 bg-gradient-to-r from-accent/50 to-transparent"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              <span className="tabular-nums text-ink-faint">/ 01</span>
              <span>Selected work</span>
            </div>
            <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink md:text-3xl">
              Recent projects
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-ink-muted md:block">
            A focused list of work — open any to see the story, stack and
            outcomes.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              onOpen={() => setActiveSlug(project.slug)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <ProjectModal
            key={active.slug}
            project={active}
            onClose={() => setActiveSlug(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
