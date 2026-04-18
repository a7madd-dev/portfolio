"use client";

import { useEffect, useState } from "react";
import type { Seo } from "@/types/seo";

const INPUT =
  "w-full rounded-lg border border-hairline bg-elevated/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-[border-color,background,box-shadow] duration-300 focus:border-accent/60 focus:bg-elevated/70 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.12)]";
const TEXTAREA = `${INPUT} min-h-[100px] resize-y leading-relaxed`;
const LABEL = "font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim";

type Draft = {
  title: string;
  titleTemplate: string;
  description: string;
  keywordsText: string;
  ogImage: string;
  authorName: string;
  siteUrl: string;
  twitterHandle: string;
};

function toDraft(s: Seo): Draft {
  return {
    title: s.title,
    titleTemplate: s.titleTemplate ?? "",
    description: s.description,
    keywordsText: s.keywords.join(", "),
    ogImage: s.ogImage ?? "",
    authorName: s.authorName,
    siteUrl: s.siteUrl ?? "",
    twitterHandle: s.twitterHandle ?? "",
  };
}

function fromDraft(d: Draft) {
  return {
    title: d.title,
    titleTemplate: d.titleTemplate,
    description: d.description,
    keywords: d.keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    ogImage: d.ogImage,
    authorName: d.authorName,
    siteUrl: d.siteUrl,
    twitterHandle: d.twitterHandle,
  };
}

export default function SeoAdmin({ initial }: { initial: Seo }) {
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

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(fromDraft(draft)),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Save failed (${res.status})`);
      }
      const data = (await res.json()) as { seo: Seo };
      setDraft(toDraft(data.seo));
      setToast({ tone: "ok", msg: "SEO metadata saved" });
    } catch (err) {
      setToast({
        tone: "err",
        msg: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  const previewTitle = draft.titleTemplate
    ? draft.titleTemplate.replace("%s", draft.title || "Portfolio")
    : draft.title || "Portfolio";

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            / SEO
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">SEO</h1>
          <p className="max-w-md text-sm text-ink-muted">
            Metadata, OpenGraph and Twitter card. Changes rebuild the root
            layout — your next page view reflects them.
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
        <h2 className="text-sm font-medium text-ink">Core</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              className={INPUT}
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="My portfolio"
            />
          </Field>
          <Field label="Title template (use %s)">
            <input
              className={INPUT}
              value={draft.titleTemplate}
              onChange={(e) => update("titleTemplate", e.target.value)}
              placeholder="%s — Ahmad Yousef"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={TEXTAREA}
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="One or two sentences — shown in search results."
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Keywords (comma separated)">
              <input
                className={INPUT}
                value={draft.keywordsText}
                onChange={(e) => update("keywordsText", e.target.value)}
                placeholder="design engineer, fullstack, nextjs"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-hairline bg-surface/60 p-6">
        <h2 className="text-sm font-medium text-ink">Author & identity</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Author name">
            <input
              className={INPUT}
              value={draft.authorName}
              onChange={(e) => update("authorName", e.target.value)}
              placeholder="Ahmad Yousef"
            />
          </Field>
          <Field label="Twitter handle (with @)">
            <input
              className={INPUT}
              value={draft.twitterHandle}
              onChange={(e) => update("twitterHandle", e.target.value)}
              placeholder="@yourhandle"
            />
          </Field>
          <Field label="Site URL">
            <input
              className={INPUT}
              value={draft.siteUrl}
              onChange={(e) => update("siteUrl", e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
          <Field label="OG image URL">
            <input
              className={INPUT}
              value={draft.ogImage}
              onChange={(e) => update("ogImage", e.target.value)}
              placeholder="https://example.com/og.png"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-hairline bg-surface/60 p-6">
        <h2 className="text-sm font-medium text-ink">Preview</h2>
        <div className="space-y-1 rounded-lg border border-hairline bg-elevated/30 p-4">
          <p className="truncate text-base text-accent-soft">{previewTitle}</p>
          <p className="truncate font-mono text-[11px] text-ink-faint">
            {draft.siteUrl || "https://example.com"}
          </p>
          <p className="line-clamp-2 text-sm text-ink-muted">
            {draft.description || "Description will appear here."}
          </p>
        </div>
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
