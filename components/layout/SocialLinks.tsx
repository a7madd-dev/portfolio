const socials = [
  { label: "GitHub", href: "https://github.com", external: true },
  { label: "LinkedIn", href: "https://linkedin.com", external: true },
  { label: "Email", href: "mailto:a7madd5111@gmail.com", external: false },
] as const;

export default function SocialLinks() {
  return (
    <ul className="flex items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
      {socials.map((s, i) => (
        <li key={s.label} className="flex items-center gap-x-5">
          {i > 0 && (
            <span
              aria-hidden
              className="h-3 w-px bg-hairline-strong"
            />
          )}
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
