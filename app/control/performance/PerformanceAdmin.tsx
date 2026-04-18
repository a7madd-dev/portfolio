"use client";

import { useEffect, useState } from "react";
import type {
  CategoryDatum,
  Performance,
  PerformanceStats,
  SkillDatum,
  TimelineDatum,
} from "@/types/performance";

const INPUT =
  "w-full rounded-lg border border-hairline bg-elevated/40 px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-[border-color,background,box-shadow] duration-300 focus:border-accent/60 focus:bg-elevated/70 focus:shadow-[0_0_0_3px_rgba(124,92,255,0.12)]";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim";

type Draft = {
  stats: { [K in keyof PerformanceStats]: string };
  skills: { label: string; value: string }[];
  categories: { label: string; value: string; color: string }[];
  timeline: { label: string; value: string }[];
};

function toDraft(p: Performance): Draft {
  return {
    stats: {
      projectsCompleted: String(p.stats.projectsCompleted),
      yearsExperience: String(p.stats.yearsExperience),
      clients: String(p.stats.clients),
      technologies: String(p.stats.technologies),
    },
    skills: p.skills.map((s) => ({ label: s.label, value: String(s.value) })),
    categories: p.categories.map((c) => ({
      label: c.label,
      value: String(c.value),
      color: c.color ?? "",
    })),
    timeline: p.timeline.map((t) => ({
      label: t.label,
      value: String(t.value),
    })),
  };
}

function fromDraft(d: Draft) {
  const num = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  return {
    stats: {
      projectsCompleted: num(d.stats.projectsCompleted),
      yearsExperience: num(d.stats.yearsExperience),
      clients: num(d.stats.clients),
      technologies: num(d.stats.technologies),
    },
    skills: d.skills
      .map((s): SkillDatum => ({ label: s.label.trim(), value: num(s.value) }))
      .filter((s) => s.label),
    categories: d.categories
      .map(
        (c): CategoryDatum => ({
          label: c.label.trim(),
          value: num(c.value),
          color: c.color.trim() || undefined,
        }),
      )
      .filter((c) => c.label),
    timeline: d.timeline
      .map((t): TimelineDatum => ({ label: t.label.trim(), value: num(t.value) }))
      .filter((t) => t.label),
  };
}

export default function PerformanceAdmin({ initial }: { initial: Performance }) {
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

  function updateStat(k: keyof PerformanceStats, v: string) {
    setDraft((d) => ({ ...d, stats: { ...d.stats, [k]: v } }));
  }

  function updateSkill(i: number, patch: Partial<Draft["skills"][number]>) {
    setDraft((d) => ({
      ...d,
      skills: d.skills.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  function updateCategory(
    i: number,
    patch: Partial<Draft["categories"][number]>,
  ) {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      ),
    }));
  }

  function updateTimeline(
    i: number,
    patch: Partial<Draft["timeline"][number]>,
  ) {
    setDraft((d) => ({
      ...d,
      timeline: d.timeline.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      ),
    }));
  }

  function addRow(key: "skills" | "categories" | "timeline") {
    setDraft((d) => {
      if (key === "skills") {
        return { ...d, skills: [...d.skills, { label: "", value: "50" }] };
      }
      if (key === "categories") {
        return {
          ...d,
          categories: [...d.categories, { label: "", value: "1", color: "" }],
        };
      }
      return { ...d, timeline: [...d.timeline, { label: "", value: "0" }] };
    });
  }

  function removeRow(key: "skills" | "categories" | "timeline", i: number) {
    setDraft((d) => ({
      ...d,
      [key]: (d[key] as unknown[]).filter((_, idx) => idx !== i),
    }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/performance", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(fromDraft(draft)),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Save failed (${res.status})`);
      }
      const data = (await res.json()) as { performance: Performance };
      setDraft(toDraft(data.performance));
      setToast({ tone: "ok", msg: "Performance saved" });
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
            / Performance
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">
            Performance
          </h1>
          <p className="max-w-md text-sm text-ink-muted">
            Stats, skill mix, project shape and delivery cadence — the data
            behind the Insights section. Saves to{" "}
            <code className="font-mono text-ink">content/performance.json</code>.
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
        <h2 className="text-sm font-medium text-ink">Headline stats</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Projects completed">
            <input
              type="number"
              className={INPUT}
              value={draft.stats.projectsCompleted}
              onChange={(e) =>
                updateStat("projectsCompleted", e.target.value)
              }
            />
          </Field>
          <Field label="Years of experience">
            <input
              type="number"
              className={INPUT}
              value={draft.stats.yearsExperience}
              onChange={(e) => updateStat("yearsExperience", e.target.value)}
            />
          </Field>
          <Field label="Clients served">
            <input
              type="number"
              className={INPUT}
              value={draft.stats.clients}
              onChange={(e) => updateStat("clients", e.target.value)}
            />
          </Field>
          <Field label="Technologies used">
            <input
              type="number"
              className={INPUT}
              value={draft.stats.technologies}
              onChange={(e) => updateStat("technologies", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <RepeaterSection
        title="Skills · bar chart"
        subtitle="Values are proficiency from 0–100."
        onAdd={() => addRow("skills")}
      >
        {draft.skills.length === 0 ? (
          <EmptyNote>No skills yet.</EmptyNote>
        ) : (
          <ul className="space-y-3">
            {draft.skills.map((s, i) => (
              <li
                key={i}
                className="grid gap-3 rounded-lg border border-hairline bg-elevated/30 p-4 md:grid-cols-[1.5fr_120px_auto]"
              >
                <input
                  className={INPUT}
                  value={s.label}
                  onChange={(e) => updateSkill(i, { label: e.target.value })}
                  placeholder="TypeScript"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={INPUT}
                  value={s.value}
                  onChange={(e) => updateSkill(i, { value: e.target.value })}
                  placeholder="0–100"
                />
                <IconBtn
                  onClick={() => removeRow("skills", i)}
                  label="Remove"
                  tone="danger"
                >
                  ×
                </IconBtn>
              </li>
            ))}
          </ul>
        )}
      </RepeaterSection>

      <RepeaterSection
        title="Categories · donut chart"
        subtitle="Relative weights — use any scale, values are normalized."
        onAdd={() => addRow("categories")}
      >
        {draft.categories.length === 0 ? (
          <EmptyNote>No categories yet.</EmptyNote>
        ) : (
          <ul className="space-y-3">
            {draft.categories.map((c, i) => (
              <li
                key={i}
                className="grid gap-3 rounded-lg border border-hairline bg-elevated/30 p-4 md:grid-cols-[1.5fr_120px_160px_auto]"
              >
                <input
                  className={INPUT}
                  value={c.label}
                  onChange={(e) => updateCategory(i, { label: e.target.value })}
                  placeholder="Web apps"
                />
                <input
                  type="number"
                  min={0}
                  className={INPUT}
                  value={c.value}
                  onChange={(e) => updateCategory(i, { value: e.target.value })}
                  placeholder="Weight"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="h-10 w-10 flex-none cursor-pointer rounded-lg border border-hairline bg-elevated"
                    value={c.color || "#7c5cff"}
                    onChange={(e) =>
                      updateCategory(i, { color: e.target.value })
                    }
                  />
                  <input
                    className={INPUT}
                    value={c.color}
                    onChange={(e) =>
                      updateCategory(i, { color: e.target.value })
                    }
                    placeholder="#7C5CFF"
                  />
                </div>
                <IconBtn
                  onClick={() => removeRow("categories", i)}
                  label="Remove"
                  tone="danger"
                >
                  ×
                </IconBtn>
              </li>
            ))}
          </ul>
        )}
      </RepeaterSection>

      <RepeaterSection
        title="Timeline · line chart"
        subtitle="Label + value pairs, rendered in insert order."
        onAdd={() => addRow("timeline")}
      >
        {draft.timeline.length === 0 ? (
          <EmptyNote>No timeline entries yet.</EmptyNote>
        ) : (
          <ul className="space-y-3">
            {draft.timeline.map((t, i) => (
              <li
                key={i}
                className="grid gap-3 rounded-lg border border-hairline bg-elevated/30 p-4 md:grid-cols-[1.5fr_120px_auto]"
              >
                <input
                  className={INPUT}
                  value={t.label}
                  onChange={(e) => updateTimeline(i, { label: e.target.value })}
                  placeholder="2024"
                />
                <input
                  type="number"
                  min={0}
                  className={INPUT}
                  value={t.value}
                  onChange={(e) => updateTimeline(i, { value: e.target.value })}
                  placeholder="0"
                />
                <IconBtn
                  onClick={() => removeRow("timeline", i)}
                  label="Remove"
                  tone="danger"
                >
                  ×
                </IconBtn>
              </li>
            ))}
          </ul>
        )}
      </RepeaterSection>

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

function RepeaterSection({
  title,
  subtitle,
  onAdd,
  children,
}: {
  title: string;
  subtitle?: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-hairline bg-surface/60 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
        </div>
        <button
          onClick={onAdd}
          className="rounded-full border border-hairline bg-elevated/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
        >
          + Add row
        </button>
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline bg-elevated/20 p-6 text-center text-sm text-ink-muted">
      {children}
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
    "inline-flex h-9 w-9 items-center justify-center rounded-full border bg-elevated/50 text-sm transition-colors duration-300";
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
