import "server-only";

import { cookies } from "next/headers";

export const AUTH_COOKIE = "control_auth";
const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getPassword(): string {
  // Use CONTROL_PASSWORD from the environment in production; fall back to
  // "admin" for local dev so the control panel works out of the box.
  return process.env.CONTROL_PASSWORD?.trim() || "admin";
}

// Constant-time compare to avoid timing side-channels on password check.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function verifyPassword(input: string): boolean {
  return timingSafeEqual(String(input ?? ""), getPassword());
}

// The token is intentionally opaque — any presence of the env-gated cookie is
// sufficient. If you need revocation later, swap to a signed JWT.
function token(): string {
  const seed = process.env.CONTROL_PASSWORD?.trim() || "admin";
  // Simple, deterministic: hash-ish over the configured password. Not secret
  // on its own — the protection is that an attacker must know the password to
  // make the cookie match the server's expected value.
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const v = jar.get(AUTH_COOKIE)?.value;
  return !!v && v === token();
}

export async function grantAuth(): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAuth(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
}
