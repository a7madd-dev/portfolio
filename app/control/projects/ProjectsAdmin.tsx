"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";
import ProjectEditor from "./ProjectEditor";
import { emptyProject, type ProjectDraft } from "./projectForm";

type Props = { initial: Project[] };

type Mode =
  | { kind: "idle" }
  | { kind: "edit"; slug: string }
  | { kind: "new" };

export default function ProjectsAdmin({ initial }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [mode, setMode] = useState<Mode>({ kind: "idle" });
  const [toast, setToast] = useState<{ tone: "ok" | "err"; msg: string } | null>(
    null,
  );

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const selected = useMemo<ProjectDraft | null>(() => {
    if (mode.kind === "new") return emptyProject();
    if (mode.kind === "edit") {
      const p = projects.find((x) => x.slug === mode.slug);
      return p ? toDraft(p) : null;
    }
    return null;
  }, [mode, projects]);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { projects: Project[] };
      setProjects(data.projects);
    }
  }, []);

  async function handleSave(draft: ProjectDraft, originalSlug: string | null) {
    const payload = fromDraft(draft);
    const url = originalSlug
      ? `/api/projects/${encodeURIComponent(originalSlug)}`
      : "/api/projects";
    const method = originalSlug ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Request failed (${res.status})`);
    }
    const data = (await res.json()) as { project: Project };
    await refresh();
    setMode({ kind: "edit", slug: data.project.slug });
    setToast({ tone: "ok", msg: originalSlug ? "Project saved" : "Project created" });
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setToast({ tone: "err", msg: data.error ?? "Delete failed" });
      return;
    }
    setMode({ kind: "idle" });
    await refresh();
    setToast({ tone: "ok", msg: "Project deleted" });
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
            / Projects
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">
            Manage projects
          </h1>
          <p className="max-w-md text-sm text-ink-muted">
            {projects.length} project{projects.length === 1 ? "" : "s"} currently
            published. Changes are written to <code className="font-mono text-ink">content/projects.json</code> immediately.
          </p>
        </div>
        <button
          onClick={() => setMode({ kind: "new" })}
          className="group inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-elevated/70 px-4 py-2 text-sm text-ink shadow-soft transition-[border-color,background,box-shadow,transform] duration-500 ease-smooth hover:-translate-y-px hover:border-accent/50 hover:shadow-[0_10px_30px_rgba(124,92,255,0.2)]"
        >
          <span
            aria-hidden
            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-accent-soft"
          >
            +
          </span>
          Add new project
        </button>
      </header>

      <div className="grid gap-3">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-hairline bg-surface/40 p-10 text-center text-sm text-ink-muted">
            No projects yet. Start by adding one.
          </div>
        ) : (
          projects.map((p) => (
            <ProjectRow
              key={p.slug}
              project={p}
              active={mode.kind === "edit" && mode.slug === p.slug}
              onEdit={() => setMode({ kind: "edit", slug: p.slug })}
              onDelete={() => handleDelete(p.slug)}
            />
          ))
        )}
      </div>

      {selected && (
        <ProjectEditor
          key={mode.kind === "edit" ? mode.slug : "new"}
          draft={selected}
          originalSlug={mode.kind === "edit" ? mode.slug : null}
          onClose={() => setMode({ kind: "idle" })}
          onSave={handleSave}
        />
      )}

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

function ProjectRow({
  project,
  active,
  onEdit,
  onDelete,
}: {
  project: Project;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const accent = project.accent ?? "#7C5CFF";
  return (
    <article
      className={`group relative flex items-center gap-4 rounded-xl border bg-surface/60 p-4 transition-[border-color,background,box-shadow] duration-500 ease-smooth ${
        active
          ? "border-hairline-strong bg-elevated/70 shadow-card"
          : "border-hairline hover:border-hairline-strong hover:bg-elevated/40"
      }`}
    >
      <div
        aria-hidden
        className="relative h-16 w-24 flex-none overflow-hidden rounded-lg border border-hairline bg-elevated"
      >
        {project.cover.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover.src}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${accent}33 100%)`,
          }}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
          <span>{project.year}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
          <span className="truncate">{project.role}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-ink-faint" />
          <span className="truncate">/{project.slug}</span>
        </div>
        <h3 className="truncate text-base font-medium tracking-tight">
          {project.title}
        </h3>
        <p className="truncate text-sm text-ink-muted">{project.tagline}</p>
      </div>

      <div className="flex flex-none items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-full border border-hairline bg-elevated/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-accent/50 hover:text-ink"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${project.title}`}
          className="rounded-full border border-hairline bg-elevated/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-rose-500/50 hover:text-rose-200"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function toDraft(p: Project): ProjectDraft {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    year: String(p.year),
    role: p.role,
    accent: p.accent ?? "",
    cover: {
      src: p.cover.src,
      alt: p.cover.alt,
      width: String(p.cover.width),
      height: String(p.cover.height),
    },
    gallery: p.gallery.map((g) => ({
      src: g.src,
      alt: g.alt,
      width: String(g.width),
      height: String(g.height),
    })),
    tech: [...p.tech],
    links: (p.links ?? []).map((l) => ({ ...l })),
  };
}

function fromDraft(draft: ProjectDraft) {
  return {
    slug: draft.slug.trim() || undefined,
    title: draft.title,
    tagline: draft.tagline,
    description: draft.description,
    year: Number.parseInt(draft.year, 10),
    role: draft.role,
    accent: draft.accent.trim() || undefined,
    cover: {
      src: draft.cover.src,
      alt: draft.cover.alt,
      width: Number.parseInt(draft.cover.width, 10) || 1600,
      height: Number.parseInt(draft.cover.height, 10) || 1000,
    },
    gallery: draft.gallery
      .filter((g) => g.src.trim())
      .map((g) => ({
        src: g.src,
        alt: g.alt,
        width: Number.parseInt(g.width, 10) || 1600,
        height: Number.parseInt(g.height, 10) || 1000,
      })),
    tech: draft.tech.filter((t) => t.trim()),
    links: draft.links.filter((l) => l.label.trim() && l.href.trim()),
  };
}
