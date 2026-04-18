export type PerformanceStats = {
  projectsCompleted: number;
  yearsExperience: number;
  clients: number;
  technologies: number;
};

export type SkillDatum = {
  label: string;
  value: number; // 0–100, normalized proficiency
};

export type CategoryDatum = {
  label: string;
  value: number;
  color?: string;
};

export type TimelineDatum = {
  label: string;
  value: number;
};

export type Performance = {
  stats: PerformanceStats;
  skills: SkillDatum[];
  categories: CategoryDatum[];
  timeline: TimelineDatum[];
};
