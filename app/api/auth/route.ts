import type { NextRequest } from "next/server";
import { clearAuth, grantAuth, isAuthed, verifyPassword } from "@/lib/auth";

export async function GET() {
  return Response.json({ authed: await isAuthed() });
}

export async function POST(request: NextRequest) {
  let body: { password?: unknown };
  try {
    body = (await request.json()) as { password?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyPassword(password)) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }
  await grantAuth();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await clearAuth();
  return Response.json({ ok: true });
}
