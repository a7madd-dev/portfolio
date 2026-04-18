import "server-only";

import type { Contact, SocialKind, SocialLink } from "@/types/contact";
import { createJsonStore } from "@/lib/jsonStore";

const defaults: Contact = {
  email: "",
  phone: "",
  location: "",
  socials: [],
};

const VALID_KINDS: SocialKind[] = [
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

const store = createJsonStore<Contact>("contact.json", defaults);

function normalize(input: unknown): Contact {
  const src = (input ?? {}) as Partial<Contact>;
  const socials: SocialLink[] = Array.isArray(src.socials)
    ? src.socials
        .map((s): SocialLink | null => {
          const label = String(s?.label ?? "").trim();
          const href = String(s?.href ?? "").trim();
          if (!label || !href) return null;
          const kindRaw = String(s?.kind ?? "other").toLowerCase();
          const kind = (VALID_KINDS as string[]).includes(kindRaw)
            ? (kindRaw as SocialKind)
            : "other";
          return { label, href, kind };
        })
        .filter((s): s is SocialLink => s !== null)
    : [];

  return {
    email: String(src.email ?? "").trim(),
    phone: src.phone ? String(src.phone).trim() : "",
    location: src.location ? String(src.location).trim() : "",
    socials,
  };
}

export const getContact = () => store.read();
export const setContact = (next: unknown) => store.write(normalize(next));
