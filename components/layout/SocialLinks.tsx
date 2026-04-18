import type { Contact, SocialLink } from "@/types/contact";

type Props = {
  contact: Contact;
};

/**
 * Rendered in the side panel as a text-only list. The footer uses its own
 * icon-driven treatment — this is the minimalist variant that fits in the
 * narrow identity column.
 */
export default function SocialLinks({ contact }: Props) {
  const items: Array<{ label: string; href: string; external: boolean }> = [];

  for (const s of contact.socials) {
    items.push({ label: s.label, href: s.href, external: true });
  }
  if (contact.email) {
    items.push({
      label: "Email",
      href: `mailto:${contact.email}`,
      external: false,
    });
  }

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
      {items.map((s, i) => (
        <li key={`${s.label}-${i}`} className="flex items-center gap-x-5">
          {i > 0 && <span aria-hidden className="h-3 w-px bg-hairline-strong" />}
          <a
            href={s.href}
            target={s.external ? "_blank" : undefined}
            rel={s.external ? "noopener noreferrer" : undefined}
            className="group inline-flex items-center gap-1.5 transition-colors duration-500 ease-smooth hover:text-ink"
          >
            {s.label}
            <span
              aria-hidden
              className="translate-y-px text-ink-faint opacity-0 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:opacity-100 group-hover:text-accent-soft"
            >
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export type { SocialLink };
