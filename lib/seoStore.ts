import "server-only";

import type { Seo } from "@/types/seo";
import { createJsonStore } from "@/lib/jsonStore";

const defaults: Seo = {
  title: "Portfolio",
  titleTemplate: undefined,
  description: "",
  keywords: [],
  ogImage: undefined,
  authorName: "",
  siteUrl: undefined,
  twitterHandle: undefined,
};

const store = createJsonStore<Seo>("seo.json", defaults);

function normalize(input: unknown): Seo {
  const src = (input ?? {}) as Partial<Seo>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const opt = (v: unknown) => {
    const s = str(v);
    return s || undefined;
  };
  return {
    title: str(src.title) || "Portfolio",
    titleTemplate: opt(src.titleTemplate),
    description: str(src.description),
    keywords: Array.isArray(src.keywords)
      ? src.keywords.map((k) => String(k).trim()).filter(Boolean)
      : [],
    ogImage: opt(src.ogImage),
    authorName: str(src.authorName),
    siteUrl: opt(src.siteUrl),
    twitterHandle: opt(src.twitterHandle),
  };
}

export const getSeo = () => store.read();
export const setSeo = (next: unknown) => store.write(normalize(next));
