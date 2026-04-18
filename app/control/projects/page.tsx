import { listProjects } from "@/lib/projectStore";
import ProjectsAdmin from "./ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function ControlProjectsPage() {
  const projects = await listProjects();
  return <ProjectsAdmin initial={projects} />;
}
