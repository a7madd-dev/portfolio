import "server-only";

import type { Project } from "@/types/project";
import { listProjects, getProject } from "@/lib/projectStore";

// Thin facade over the store. Kept so existing import sites stay stable if
// the persistence layer is later swapped (e.g. Supabase).

export function getProjects(): Promise<Project[]> {
  return listProjects();
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return getProject(slug);
}
