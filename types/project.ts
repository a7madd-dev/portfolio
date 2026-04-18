export type ProjectLink = {
  label: string;
  href: string;
  kind: "live" | "repo" | "case";
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: number;
  role: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  tech: string[];
  links?: ProjectLink[];
  accent?: string;
};
