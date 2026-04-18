import type { ProjectLink } from "@/types/project";

// Draft shape — all numeric fields are strings while the user is editing.
// This avoids the "2025 → 202" problem when backspacing through a number input.

export type DraftImage = {
  src: string;
  alt: string;
  width: string;
  height: string;
};

export type ProjectDraft = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  accent: string;
  cover: DraftImage;
  gallery: DraftImage[];
  tech: string[];
  links: ProjectLink[];
};

export function emptyImage(): DraftImage {
  return { src: "", alt: "", width: "1600", height: "1000" };
}

export function emptyProject(): ProjectDraft {
  return {
    slug: "",
    title: "",
    tagline: "",
    description: "",
    year: String(new Date().getFullYear()),
    role: "",
    accent: "",
    cover: emptyImage(),
    gallery: [],
    tech: [],
    links: [],
  };
}
