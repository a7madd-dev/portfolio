"use client";

import type { ProjectDraft } from "./projectForm";

// A trimmed mirror of ProjectCard — no framer-motion, plain <img> so it renders
// any URL the editor is currently pointing at, even pre-save.
export default function PreviewCard({ draft }: { draft: ProjectDraft }) {
  const accent = draft.accent?.trim() || "#7C5CFF";
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface/80 shadow-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
        {draft.cover.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={draft.cover.src}
            alt={draft.cover.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-faint">
            Cover image preview
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/15 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 50% 100%, ${accent}33, transparent 70%)`,
          }}
        />
      </div>

      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            <span>{draft.year || "—"}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
            <span className="truncate">{draft.role || "Role"}</span>
          </div>
          <h3 className="truncate text-base font-medium tracking-tight text-ink">
            {draft.title || "Untitled project"}
          </h3>
          <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
            {draft.tagline || "Short tagline appears here."}
          </p>
          {draft.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {draft.tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-elevated/70 px-2 py-0.5 text-[10px] text-ink-muted"
                >
                  {t}
                </span>
              ))}
              {draft.tech.length > 5 && (
                <span className="text-[10px] text-ink-faint">
                  +{draft.tech.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
