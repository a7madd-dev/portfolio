"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/control/projects", label: "Projects", hint: "Manage case studies" },
  { href: "/control/performance", label: "Performance", hint: "Stats & charts" },
  { href: "/control/seo", label: "SEO", hint: "Metadata & sharing" },
  { href: "/control/contact", label: "Contact", hint: "Email & socials" },
  { href: "/control/settings", label: "Settings", hint: "Portfolio meta" },
];

export default function ControlShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      {/* Ambient tint so the panel feels of-a-piece with the portfolio shell. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(40%_30%_at_0%_0%,rgba(124,92,255,0.08),transparent_60%),radial-gradient(30%_30%_at_100%_100%,rgba(94,234,212,0.05),transparent_70%)]"
      />
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="relative flex flex-col justify-between border-r border-hairline bg-surface/60 px-6 py-8 backdrop-blur-sm md:sticky md:top-0 md:h-screen">
          <div className="space-y-10">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim transition-colors duration-300 hover:text-ink"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-hairline bg-elevated/50 text-ink-muted transition-colors group-hover:text-ink">
                ←
              </span>
              Portfolio
            </Link>

            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                Control
              </p>
              <h2 className="text-lg font-semibold tracking-[-0.01em]">Dashboard</h2>
            </div>

            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative block rounded-lg border px-3 py-2.5 transition-[border-color,background,color] duration-300 ${
                      active
                        ? "border-hairline-strong bg-elevated/70 text-ink"
                        : "border-transparent text-ink-muted hover:border-hairline hover:bg-elevated/40 hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      {active && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(124,92,255,0.6)]"
                        />
                      )}
                    </div>
                    <span className="block text-[11px] text-ink-faint">
                      {item.hint}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={signOut}
            className="group inline-flex items-center gap-2 self-start rounded-full border border-hairline bg-elevated/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-[color,border-color] duration-300 hover:border-hairline-strong hover:text-ink"
          >
            <span
              aria-hidden
              className="inline-flex h-1.5 w-1.5 rounded-full bg-ink-faint transition-colors group-hover:bg-accent"
            />
            Sign out
          </button>
        </aside>

        <main className="relative">
          <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-14">{children}</div>
        </main>
      </div>
    </div>
  );
}
