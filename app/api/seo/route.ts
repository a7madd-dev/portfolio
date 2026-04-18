import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { getSeo, setSeo } from "@/lib/seoStore";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  const seo = await getSeo();
  return Response.json({ seo });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const seo = await setSeo(body);
  // SEO lives in the root layout — bust the home path so new metadata renders.
  revalidatePath("/", "layout");
  return Response.json({ seo });
}
