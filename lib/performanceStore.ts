import "server-only";

import type { Performance } from "@/types/performance";
import { createJsonStore } from "@/lib/jsonStore";

const defaults: Performance = {
  stats: {
    projectsCompleted: 0,
    yearsExperience: 0,
    clients: 0,
    technologies: 0,
  },
  skills: [],
  categories: [],
  timeline: [],
};

const store = createJsonStore<Performance>("performance.json", defaults);

function toInt(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function toFloat(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalize(input: unknown): Performance {
  const src = (input ?? {}) as Partial<Performance>;
  return {
    stats: {
      projectsCompleted: toInt(src.stats?.projectsCompleted),
      yearsExperience: toInt(src.stats?.yearsExperience),
      clients: toInt(src.stats?.clients),
      technologies: toInt(src.stats?.technologies),
    },
    skills: Array.isArray(src.skills)
      ? src.skills
          .map((s) => ({
            label: String(s?.label ?? "").trim(),
            value: Math.max(0, Math.min(100, toFloat(s?.value))),
          }))
          .filter((s) => s.label)
      : [],
    categories: Array.isArray(src.categories)
      ? src.categories
          .map((c) => ({
            label: String(c?.label ?? "").trim(),
            value: Math.max(0, toFloat(c?.value)),
            color: c?.color ? String(c.color).trim() : undefined,
          }))
          .filter((c) => c.label)
      : [],
    timeline: Array.isArray(src.timeline)
      ? src.timeline
          .map((t) => ({
            label: String(t?.label ?? "").trim(),
            value: Math.max(0, toFloat(t?.value)),
          }))
          .filter((t) => t.label)
      : [],
  };
}

export const getPerformance = () => store.read();
export const setPerformance = (next: unknown) => store.write(normalize(next));
