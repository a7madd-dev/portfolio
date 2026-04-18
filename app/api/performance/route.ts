import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { getPerformance, setPerformance } from "@/lib/performanceStore";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  const performance = await getPerformance();
  return Response.json({ performance });
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
  const performance = await setPerformance(body);
  revalidatePath("/");
  return Response.json({ performance });
}
