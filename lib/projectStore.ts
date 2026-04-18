import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Project, ProjectImage, ProjectLink } from "@/types/project";
import { BLUR_DATA_URL } from "@/lib/blur";

/**
 * Single source of truth for project data.
 *
 * The physical store is a JSON file on disk. All writes are serialized through
 * `writeQueue` so concurrent route-handler requests never interleave their
 * read-modify-write cycles. The abstraction is deliberately thin: swapping
 * this for Supabase later is a matter of replacing readAll/writeAll.
 */

const DATA_PATH = path.join(process.cwd(), "content", "projects.json");

type StoredImage = Omit<ProjectImage, "blurDataURL"> & { blurDataURL?: string };
type Stored = Omit<Project, "cover" | "gallery"> & {
  cover: StoredImage;
  gallery: StoredImage[];
};

async function readAll(): Promise<Stored[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Stored[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(next: Stored[]): Promise<void> {
  const tmp = `${DATA_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, DATA_PATH);
}

// In-process write lock — chains mutations so they run serially.
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(op: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(op, op);
  writeQueue = run.catch(() => undefined);
  return run;
}

function hydrate(stored: Stored): Project {
  return {
    ...stored,
    cover: { ...stored.cover, blurDataURL: stored.cover.blurDataURL ?? BLUR_DATA_URL },
    gallery: stored.gallery.map((g) => ({
      ...g,
      blurDataURL: g.blurDataURL ?? BLUR_DATA_URL,
    })),
  };
}

export async function listProjects(): Promise<Project[]> {
  const all = await readAll();
  return all.map(hydrate);
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await readAll();
  const match = all.find((p) => p.slug === slug);
  return match ? hydrate(match) : null;
}

export type ProjectInput = {
  slug?: string;
  title: string;
  tagline: string;
  description: string;
  year: number;
  role: string;
  accent?: string;
  cover: StoredImage;
  gallery: StoredImage[];
  tech: string[];
  links?: ProjectLink[];
};

export class ProjectStoreError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function normalizeImage(img: StoredImage | undefined): StoredImage {
  if (!img || typeof img.src !== "string" || !img.src.trim()) {
    throw new ProjectStoreError(400, "cover.src is required");
  }
  return {
    src: img.src.trim(),
    alt: typeof img.alt === "string" ? img.alt.trim() : "",
    width: Number.isFinite(img.width) && img.width! > 0 ? img.width : 1600,
    height: Number.isFinite(img.height) && img.height! > 0 ? img.height : 1000,
  };
}

function normalize(input: ProjectInput, fallbackSlug?: string): Stored {
  if (!input || typeof input !== "object") {
    throw new ProjectStoreError(400, "Body must be a JSON object");
  }
  const title = (input.title ?? "").toString().trim();
  if (!title) throw new ProjectStoreError(400, "title is required");

  const slug = slugify((input.slug ?? fallbackSlug ?? title).toString());
  if (!slug) throw new ProjectStoreError(400, "slug could not be derived");

  const year = Number(input.year);
  if (!Number.isInteger(year) || year < 1970 || year > 3000) {
    throw new ProjectStoreError(400, "year must be an integer");
  }

  const tech = Array.isArray(input.tech)
    ? input.tech.map((t) => String(t).trim()).filter(Boolean)
    : [];

  const links: ProjectLink[] = Array.isArray(input.links)
    ? input.links
        .map((l) => ({
          label: String(l?.label ?? "").trim(),
          href: String(l?.href ?? "").trim(),
          kind: (["live", "repo", "case"] as const).includes(l?.kind as never)
            ? (l.kind as ProjectLink["kind"])
            : "live",
        }))
        .filter((l) => l.label && l.href)
    : [];

  const gallery = Array.isArray(input.gallery)
    ? input.gallery.filter((g) => g && typeof g.src === "string" && g.src.trim()).map(normalizeImage)
    : [];

  return {
    slug,
    title,
    tagline: (input.tagline ?? "").toString().trim(),
    description: (input.description ?? "").toString().trim(),
    year,
    role: (input.role ?? "").toString().trim(),
    accent: input.accent ? String(input.accent).trim() : undefined,
    cover: normalizeImage(input.cover),
    gallery,
    tech,
    links: links.length ? links : undefined,
  };
}

export function createProject(input: ProjectInput): Promise<Project> {
  return enqueue(async () => {
    const all = await readAll();
    const next = normalize(input);
    if (all.some((p) => p.slug === next.slug)) {
      throw new ProjectStoreError(409, `A project with slug "${next.slug}" already exists`);
    }
    all.unshift(next);
    await writeAll(all);
    return hydrate(next);
  });
}

export function updateProject(slug: string, input: ProjectInput): Promise<Project> {
  return enqueue(async () => {
    const all = await readAll();
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx === -1) throw new ProjectStoreError(404, `Project "${slug}" not found`);
    const next = normalize(input, slug);
    // Renaming the slug is allowed, but not onto another project's slug.
    if (next.slug !== slug && all.some((p) => p.slug === next.slug)) {
      throw new ProjectStoreError(409, `A project with slug "${next.slug}" already exists`);
    }
    all[idx] = next;
    await writeAll(all);
    return hydrate(next);
  });
}

export function deleteProject(slug: string): Promise<void> {
  return enqueue(async () => {
    const all = await readAll();
    const idx = all.findIndex((p) => p.slug === slug);
    if (idx === -1) throw new ProjectStoreError(404, `Project "${slug}" not found`);
    all.splice(idx, 1);
    await writeAll(all);
  });
}

export function reorderProjects(slugs: string[]): Promise<Project[]> {
  return enqueue(async () => {
    const all = await readAll();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    const reordered: Stored[] = [];
    for (const slug of slugs) {
      const found = bySlug.get(slug);
      if (found) {
        reordered.push(found);
        bySlug.delete(slug);
      }
    }
    // Append any projects that weren't in the input to preserve them.
    for (const leftover of bySlug.values()) reordered.push(leftover);
    await writeAll(reordered);
    return reordered.map(hydrate);
  });
}
