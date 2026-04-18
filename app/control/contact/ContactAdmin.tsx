"use client";

import { useEffect, useState } from "react";
import type { Contact, SocialKind, SocialLink } from "@/types/contact";

const INPUT =
  "w-full rounded-lg border border-hairline bg-elevated/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-[border-color,background,box-shadow] duration-300 focus:border-accent/60 focus:bg-elevated/70 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.12)]";
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim";

const KINDS: SocialKind[] = [
  "github",
  "linkedin",
  "twitter",
  "x",
  "instagram",
  "dribbble",
  "youtube",
  "website",
  "other",
];

type Draft = {
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
};

function toDraft(c: Contact): Draft {
  return {
    email: c.email,
    phone: c.phone ?? "",
    location: c.location ?? "",
    socials: c.socials.map((s) => ({ ...s })),
  };
}

export default function ContactAdmin({ initial }: { initial: Contact }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ tone: "ok" | "err"; msg: string } | null>(
    null,
  );

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    setDraft((d) => ({
      ...d,
      socials: d.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  function addSocial() {
    setDraft((d) => ({
      ...d,
      socials: [...d.socials, { label: "", href: "", kind: "other" }],
    }));
  }

  function removeSocial(i: number) {
    setDraft((d) => ({
      ...d,
      socials: d.socials.filter((_, idx) => idx !== i),
    }));
  }

  function moveSocial(i: number, dir: -1 | 1) {
    setDraft((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.socials.length) return d;
      const next = [...d.socials];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, socials: next };
    });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Save failed (${res.status})`);
      }
      const data = (await res.json()) as { contact: Contact };
      setDraft(toDraft(data.contact));
      setToast({ tone: "ok", msg: "Contact saved" });
    } catch (err) {
      setToast({
        tone: "err",
        msg: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            / Contact
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">Contact</h1>
          <p className="max-w-md text-sm text-ink-muted">
            The email and socials rendered in the side panel, contact section
            and footer. Saves to{" "}
            <code className="font-mono text-ink">content/contact.json</code>.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="group inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-elevated/70 px-4 py-2 text-sm text-ink shadow-soft transition-[border-color,background,box-shadow,transform] duration-500 ease-smooth hover:-translate-y-px hover:border-accent/50 hover:shadow-[0_10px_30px_rgba(124,92,255,0.2)] disabled:opacity-60"
        >
          <span
            aria-hidden
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-accent-soft"
          >
            ↑
          </span>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </header>

      <section className="space-y-5 rounded-xl border border-hairline bg-surface/60 p-6">
        <h2 className="text-sm font-medium text-ink">Primary</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              className={INPUT}
              value={draft.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="hello@example.com"
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              className={INPUT}
              value={draft.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+00 000 000 000"
            />
          </Field>
          <Field label="Location (optional)">
            <input
              className={INPUT}
              value={draft.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, Country"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-hairline bg-surface/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Social links</h2>
          <button
            onClick={addSocial}
            className="rounded-full border border-hairline bg-elevated/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
          >
            + Add link
          </button>
        </div>

        {draft.socials.length === 0 ? (
          <div className="rounded-lg border border-dashed border-hairline bg-elevated/20 p-6 text-center text-sm text-ink-muted">
            No socials yet. Add one to get started.
          </div>
        ) : (
          <ul className="space-y-3">
            {draft.socials.map((s, i) => (
              <li
                key={i}
                className="grid gap-3 rounded-lg border border-hairline bg-elevated/30 p-4 md:grid-cols-[1fr_1.5fr_140px_auto]"
              >
                <input
                  className={INPUT}
                  value={s.label}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                  placeholder="Label (e.g. GitHub)"
                />
                <input
                  className={INPUT}
                  value={s.href}
                  onChange={(e) => updateSocial(i, { href: e.target.value })}
                  placeholder="https://…"
                />
                <select
                  className={INPUT}
                  value={s.kind}
                  onChange={(e) =>
                    updateSocial(i, { kind: e.target.value as SocialKind })
                  }
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => moveSocial(i, -1)} label="Move up">
                    ↑
                  </IconBtn>
                  <IconBtn onClick={() => moveSocial(i, 1)} label="Move down">
                    ↓
                  </IconBtn>
                  <IconBtn
                    onClick={() => removeSocial(i)}
                    label="Remove"
                    tone="danger"
                  >
                    ×
                  </IconBtn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border px-4 py-2 text-xs tracking-wide shadow-elevated backdrop-blur-md ${
            toast.tone === "ok"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-rose-500/40 bg-rose-500/10 text-rose-100"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  tone?: "neutral" | "danger";
}) {
  const base =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-elevated/50 text-sm transition-colors duration-300";
  const toneCls =
    tone === "danger"
      ? "border-hairline text-ink-muted hover:border-rose-500/50 hover:text-rose-200"
      : "border-hairline text-ink-muted hover:border-accent/50 hover:text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${base} ${toneCls}`}
    >
      {children}
    </button>
  );
}
