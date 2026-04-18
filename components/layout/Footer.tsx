"use client";

import { motion } from "framer-motion";
import type { Contact } from "@/types/contact";
import SocialIcon from "./SocialIcon";
import { fadeUp, stagger } from "@/styles/motion";

type Props = { contact: Contact };

/**
 * Bottom-of-page footer.
 *
 * Separate from <SocialLinks /> — that variant is text-only and lives in the
 * narrow identity column, this one uses icons and sits as the closing note
 * beneath the Contact section.
 */
export default function Footer({ contact }: Props) {
  const email = contact.email.trim();
  const year = new Date().getFullYear();
  const hasSocials = contact.socials.length > 0;

  return (
    <motion.footer
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-10% 0px" }}
      className="relative mt-8 border-t border-hairline pb-14 pt-10"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-20 bg-gradient-to-r from-accent/40 to-transparent"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <motion.div variants={fadeUp} className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
            Get in touch
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-2 text-base text-ink transition-colors duration-500 ease-smooth hover:text-accent-soft"
            >
              <span>{email}</span>
              <span
                aria-hidden
                className="text-ink-faint opacity-0 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:opacity-100"
              >
                →
              </span>
            </a>
          ) : (
            <p className="text-ink-muted">Email not configured.</p>
          )}
          {contact.location && (
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
              {contact.location}
            </p>
          )}
        </motion.div>

        {hasSocials && (
          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap items-center gap-2"
          >
            {contact.socials.map((s, i) => (
              <li key={`${s.href}-${i}`}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-elevated/40 text-ink-muted transition-[color,border-color,background,box-shadow] duration-500 ease-smooth hover:border-accent/50 hover:bg-elevated hover:text-ink hover:shadow-[0_8px_24px_rgba(124,92,255,0.18)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,rgba(124,92,255,0.18),transparent_70%)] opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
                  />
                  <SocialIcon kind={s.kind} className="relative" />
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-col gap-3 border-t border-hairline/70 pt-6 text-[11px] text-ink-faint md:flex-row md:items-center md:justify-between"
      >
        <p className="font-mono uppercase tracking-[0.22em]">
          © {year} · Portfolio ’26
        </p>
        <p className="font-mono uppercase tracking-[0.22em]">
          Crafted with care — typed, tested, tuned.
        </p>
      </motion.div>
    </motion.footer>
  );
}
