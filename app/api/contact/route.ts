import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { getContact, setContact } from "@/lib/contactStore";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  const contact = await getContact();
  return Response.json({ contact });
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
  const contact = await setContact(body);
  revalidatePath("/");
  return Response.json({ contact });
}
