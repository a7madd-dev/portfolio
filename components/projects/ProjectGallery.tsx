"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import type { ProjectImage } from "@/types/project";
import { useKey } from "@/lib/useKey";
import { spring } from "@/styles/motion";

type Props = {
  images: ProjectImage[];
};

export default function ProjectGallery({ images }: Props) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useKey("ArrowRight", next, total > 1);
  useKey("ArrowLeft", prev, total > 1);

  if (total === 0) return null;

  const current = images[index];

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-hairline bg-elevated shadow-soft">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={spring}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 900px"
              placeholder="blur"
              blurDataURL={current.blurDataURL}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
        {/* Inner frame highlight — subtle glass edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.04]"
        />
      </div>

      {total > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Gallery position">
            {images.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className="group relative flex h-4 items-center"
              >
                <span
                  aria-hidden
                  className="h-1 rounded-full transition-all duration-500 ease-smooth group-hover:bg-ink-dim"
                  style={{
                    width: i === index ? 28 : 8,
                    background:
                      i === index ? "var(--color-ink)" : "var(--color-hairline-strong)",
                  }}
                />
              </button>
            ))}
            <span className="ml-3 font-mono text-[10px] tabular-nums uppercase tracking-[0.2em] text-ink-faint">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NavButton onClick={prev} label="Previous image" direction="left" />
            <NavButton onClick={next} label="Next image" direction="right" />
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  onClick,
  label,
  direction,
}: {
  onClick: () => void;
  label: string;
  direction: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-elevated/40 text-ink-muted backdrop-blur-sm transition-[color,border-color,background,box-shadow] duration-500 ease-smooth hover:border-accent/50 hover:bg-elevated hover:text-ink hover:shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
        className={`transition-transform duration-500 ease-smooth ${
          direction === "left"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5"
        }`}
      >
        {direction === "left" ? (
          <path
            d="M7.5 2.5L4 6l3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M4.5 2.5L8 6l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
