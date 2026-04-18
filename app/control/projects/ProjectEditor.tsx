"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { emptyImage, type DraftImage, type ProjectDraft } from "./projectForm";
import PreviewCard from "./PreviewCard";

const INPUT =
  "w-full rounded-lg border border-hairline bg-[rgba(15,15,18,0.6)] px-3 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink-faint focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.12)]";

type Props = {
  draft: ProjectDraft;
  originalSlug: string | null;
  onClose: () => void;
  onSave: (draft: ProjectDraft, originalSlug: string | null) => Promise<void>;
};

const LINK_KINDS: Array<{ value: "live" | "repo" | "case"; label: string }> = [
  { value: "live", label: "Live" },
  { value: "repo", label: "Repo" },
  { value: "case", label: "Case" },
];

export default function ProjectEditor({
  draft: initial,
  originalSlug,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<ProjectDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function patch<K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function patchCover(partial: Partial<DraftImage>) {
    setDraft((d) => ({ ...d, cover: { ...d.cover, ...partial } }));
  }

  function updateGalleryItem(idx: number, partial: Partial<DraftImage>) {
    setDraft((d) => ({
      ...d,
      gallery: d.gallery.map((g, i) => (i === idx ? { ...g, ...partial } : g)),
    }));
  }

  function addGallery() {
    setDraft((d) => ({ ...d, gallery: [...d.gallery, emptyImage()] }));
  }
  function removeGallery(idx: number) {
    setDraft((d) => ({ ...d, gallery: d.gallery.filter((_, i) => i !== idx) }));
  }

  function commitTech() {
    const v = techInput.trim();
    if (!v) return;
    if (draft.tech.includes(v)) {
      setTechInput("");
      return;
    }
    setDraft((d) => ({ ...d, tech: [...d.tech, v] }));
    setTechInput("");
  }
  function removeTech(idx: number) {
    setDraft((d) => ({ ...d, tech: d.tech.filter((_, i) => i !== idx) }));
  }

  function addLink() {
    setDraft((d) => ({
      ...d,
      links: [...d.links, { label: "", href: "", kind: "live" }],
    }));
  }
  function removeLink(idx: number) {
    setDraft((d) => ({ ...d, links: d.links.filter((_, i) => i !== idx) }));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await onSave(draft, originalSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const heading = originalSlug ? "Edit project" : "New project";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-bg/70 backdrop-blur-xl md:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="relative my-8 w-[min(1200px,94vw)] overflow-hidden rounded-2xl border border-hairline-strong bg-surface shadow-elevated md:my-16">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-surface/90 px-6 py-4 backdrop-blur-md md:px-8">
          <div className="min-w-0 space-y-0.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">
              {originalSlug ? `Editing / ${originalSlug}` : "Draft"}
            </p>
            <h2 className="truncate text-lg font-medium tracking-[-0.01em]">
              {draft.title || heading}
            </h2>
          </div>
          <div className="flex flex-none items-center gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-hairline bg-elevated/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-hairline-strong hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving || !draft.title.trim() || !draft.cover.src.trim()}
              className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-4 py-1.5 text-xs font-medium text-ink shadow-[0_6px_20px_rgba(124,92,255,0.25)] transition-[background,box-shadow,transform] duration-500 ease-smooth hover:-translate-y-px hover:bg-accent/25 hover:shadow-[0_10px_30px_rgba(124,92,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : originalSlug ? "Save changes" : "Create project"}
            </button>
          </div>
        </header>

        {error && (
          <div className="border-b border-rose-500/30 bg-rose-500/10 px-6 py-3 text-xs text-rose-100 md:px-8">
            {error}
          </div>
        )}

        <div className="grid gap-8 p-6 md:grid-cols-[1.3fr_1fr] md:p-8">
          <div className="space-y-8">
            <Section title="Basics">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => patch("title", e.target.value)}
                    className={INPUT}
                    placeholder="Clinic System"
                  />
                </Field>
                <Field label="Slug" hint="Leave blank to derive from title">
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) => patch("slug", e.target.value)}
                    className={`${INPUT} font-mono`}
                    placeholder="clinic-system"
                  />
                </Field>
                <Field label="Year">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={draft.year}
                    onChange={(e) => patch("year", e.target.value)}
                    className={INPUT}
                    placeholder="2025"
                  />
                </Field>
                <Field label="Role">
                  <input
                    type="text"
                    value={draft.role}
                    onChange={(e) => patch("role", e.target.value)}
                    className={INPUT}
                    placeholder="Lead designer & engineer"
                  />
                </Field>
                <Field label="Tagline" className="md:col-span-2">
                  <input
                    type="text"
                    value={draft.tagline}
                    onChange={(e) => patch("tagline", e.target.value)}
                    className={INPUT}
                    placeholder="One-sentence hook."
                  />
                </Field>
                <Field label="Description" className="md:col-span-2">
                  <textarea
                    value={draft.description}
                    onChange={(e) => patch("description", e.target.value)}
                    rows={5}
                    className={`${INPUT} resize-y leading-relaxed`}
                    placeholder="Longer narrative that appears in the modal."
                  />
                </Field>
                <Field label="Accent color" hint="Hex — e.g. #7C5CFF">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={draft.accent}
                      onChange={(e) => patch("accent", e.target.value)}
                      className={`${INPUT} font-mono`}
                      placeholder="#7C5CFF"
                    />
                    <span
                      aria-hidden
                      className="inline-block h-8 w-8 flex-none rounded-full border border-hairline-strong"
                      style={{ background: draft.accent || "#7C5CFF" }}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <Section title="Cover image">
              <div className="grid gap-4 md:grid-cols-[1fr_120px_120px]">
                <Field label="URL" className="md:col-span-3">
                  <input
                    type="url"
                    value={draft.cover.src}
                    onChange={(e) => patchCover({ src: e.target.value })}
                    className={INPUT}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Alt text" className="md:col-span-3">
                  <input
                    type="text"
                    value={draft.cover.alt}
                    onChange={(e) => patchCover({ alt: e.target.value })}
                    className={INPUT}
                    placeholder="Describe the image for screen readers"
                  />
                </Field>
                <Field label="Width">
                  <input
                    type="number"
                    value={draft.cover.width}
                    onChange={(e) => patchCover({ width: e.target.value })}
                    className={INPUT}
                  />
                </Field>
                <Field label="Height">
                  <input
                    type="number"
                    value={draft.cover.height}
                    onChange={(e) => patchCover({ height: e.target.value })}
                    className={INPUT}
                  />
                </Field>
              </div>
            </Section>

            <Section
              title="Gallery"
              action={
                <button
                  type="button"
                  onClick={addGallery}
                  className="rounded-full border border-hairline bg-elevated/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
                >
                  + Image
                </button>
              }
            >
              {draft.gallery.length === 0 ? (
                <p className="rounded-lg border border-dashed border-hairline bg-surface/40 p-5 text-center text-xs text-ink-muted">
                  No gallery images yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {draft.gallery.map((g, i) => (
                    <div
                      key={i}
                      className="grid gap-3 rounded-lg border border-hairline bg-elevated/40 p-4 md:grid-cols-[1fr_auto]"
                    >
                      <div className="grid gap-3 md:grid-cols-[1fr_100px_100px]">
                        <Field label={`Image ${i + 1} URL`} className="md:col-span-3">
                          <input
                            type="url"
                            value={g.src}
                            onChange={(e) => updateGalleryItem(i, { src: e.target.value })}
                            className={INPUT}
                            placeholder="https://…"
                          />
                        </Field>
                        <Field label="Alt" className="md:col-span-3">
                          <input
                            type="text"
                            value={g.alt}
                            onChange={(e) => updateGalleryItem(i, { alt: e.target.value })}
                            className={INPUT}
                          />
                        </Field>
                        <Field label="W">
                          <input
                            type="number"
                            value={g.width}
                            onChange={(e) => updateGalleryItem(i, { width: e.target.value })}
                            className={INPUT}
                          />
                        </Field>
                        <Field label="H">
                          <input
                            type="number"
                            value={g.height}
                            onChange={(e) => updateGalleryItem(i, { height: e.target.value })}
                            className={INPUT}
                          />
                        </Field>
                      </div>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => removeGallery(i)}
                          className="rounded-full border border-hairline bg-bg/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 hover:border-rose-500/50 hover:text-rose-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Tech stack">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-elevated/40 p-2">
                  {draft.tech.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1 text-xs text-ink"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTech(i)}
                        aria-label={`Remove ${t}`}
                        className="text-ink-faint transition-colors duration-300 hover:text-rose-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        commitTech();
                      } else if (
                        e.key === "Backspace" &&
                        !techInput &&
                        draft.tech.length
                      ) {
                        removeTech(draft.tech.length - 1);
                      }
                    }}
                    onBlur={commitTech}
                    className="min-w-[140px] flex-1 border-0 bg-transparent px-2 py-1 text-sm text-ink outline-none placeholder:text-ink-faint"
                    placeholder={draft.tech.length ? "Add another…" : "Next.js, Tailwind, …"}
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Press Enter or comma to add · Backspace to remove
                </p>
              </div>
            </Section>

            <Section
              title="Links"
              action={
                <button
                  type="button"
                  onClick={addLink}
                  className="rounded-full border border-hairline bg-elevated/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
                >
                  + Link
                </button>
              }
            >
              {draft.links.length === 0 ? (
                <p className="rounded-lg border border-dashed border-hairline bg-surface/40 p-5 text-center text-xs text-ink-muted">
                  No links yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {draft.links.map((l, i) => (
                    <div
                      key={i}
                      className="grid gap-3 rounded-lg border border-hairline bg-elevated/40 p-3 md:grid-cols-[120px_1fr_2fr_auto]"
                    >
                      <select
                        value={l.kind}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            links: d.links.map((ll, idx) =>
                              idx === i
                                ? { ...ll, kind: e.target.value as typeof ll.kind }
                                : ll,
                            ),
                          }))
                        }
                        className={INPUT}
                      >
                        {LINK_KINDS.map((k) => (
                          <option key={k.value} value={k.value}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={l.label}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            links: d.links.map((ll, idx) =>
                              idx === i ? { ...ll, label: e.target.value } : ll,
                            ),
                          }))
                        }
                        className={INPUT}
                        placeholder="Label"
                      />
                      <input
                        type="url"
                        value={l.href}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            links: d.links.map((ll, idx) =>
                              idx === i ? { ...ll, href: e.target.value } : ll,
                            ),
                          }))
                        }
                        className={INPUT}
                        placeholder="https://…"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        className="rounded-full border border-hairline bg-bg/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 hover:border-rose-500/50 hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          <aside className="space-y-4 md:sticky md:top-[92px] md:self-start">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(124,92,255,0.6)]" />
              Live preview
            </div>
            <PreviewCard draft={draft} />
            <p className="text-[11px] leading-relaxed text-ink-faint">
              Preview updates as you type. Colors, cover, and metadata reflect the
              final card that renders on the portfolio home.
            </p>
          </aside>
        </div>
      </div>

    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
        <span>{label}</span>
        {hint && <span className="text-ink-faint normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
