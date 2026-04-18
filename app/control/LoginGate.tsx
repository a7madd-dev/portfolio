"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Incorrect password");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_30%,rgba(124,92,255,0.18),transparent_60%),radial-gradient(50%_40%_at_80%_100%,rgba(94,234,212,0.08),transparent_60%)]"
      />
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl border border-hairline-strong bg-surface/80 p-8 shadow-elevated backdrop-blur-xl"
      >
        <div className="space-y-2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            Portfolio CMS
          </p>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            Control panel
          </h1>
          <p className="text-sm text-ink-muted">
            Enter the password to manage projects.
          </p>
        </div>

        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            Password
          </span>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-elevated/60 px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-ink-faint focus:border-accent/60"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !password}
          className="group relative inline-flex w-full items-center justify-center gap-2 rounded-lg border border-hairline-strong bg-elevated px-4 py-3 text-sm text-ink shadow-soft transition-[border-color,background,box-shadow,transform] duration-500 ease-smooth hover:-translate-y-px hover:border-accent/50 hover:bg-elevated hover:shadow-[0_10px_30px_rgba(124,92,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Enter"}
        </button>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          Set <span className="text-ink-dim">CONTROL_PASSWORD</span> to override
        </p>
      </form>
    </main>
  );
}
