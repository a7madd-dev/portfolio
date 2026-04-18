import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import {
  createProject,
  listProjects,
  ProjectStoreError,
  type ProjectInput,
} from "@/lib/projectStore";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  const projects = await listProjects();
  return Response.json({ projects });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProjectInput;
  try {
    body = (await request.json()) as ProjectInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const project = await createProject(body);
    revalidatePath("/");
    return Response.json({ project }, { status: 201 });
  } catch (err) {
    if (err instanceof ProjectStoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
