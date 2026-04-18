import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import {
  deleteProject,
  getProject,
  ProjectStoreError,
  updateProject,
  type ProjectInput,
} from "@/lib/projectStore";
import { isAuthed } from "@/lib/auth";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ project });
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;

  let body: ProjectInput;
  try {
    body = (await request.json()) as ProjectInput;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const project = await updateProject(slug, body);
    revalidatePath("/");
    return Response.json({ project });
  } catch (err) {
    if (err instanceof ProjectStoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;

  try {
    await deleteProject(slug);
    revalidatePath("/");
    return new Response(null, { status: 204 });
  } catch (err) {
    if (err instanceof ProjectStoreError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
