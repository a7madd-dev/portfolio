"use client";

import { useCallback, useEffect, useState } from "react";

const items = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export default function SideNav() {
  const [active, setActive] = useState<string>("work");

  const onClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    event.preventDefault();
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Scroll-spy: highlight the section most in view. IntersectionObserver with
  // a vertical viewport band ensures only one section is ever "active".
  useEffect(() => {
    const ids = items.map((i) => i.href.slice(1));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Primary" className="font-mono text-xs uppercase">
      <ul className="space-y-3.5">
        {items.map((item, i) => {
          const id = item.href.slice(1);
          const isActive = active === id;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={onClick}
                aria-current={isActive ? "true" : undefined}
                className={`group inline-flex items-center gap-4 transition-colors duration-500 ease-smooth ${
                  isActive ? "text-ink" : "text-ink-dim hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-px transition-all duration-500 ease-smooth ${
                    isActive
                      ? "w-8 bg-accent"
                      : "w-4 bg-hairline-strong group-hover:w-6 group-hover:bg-ink-dim"
                  }`}
                />
                <span
                  className={`tabular-nums transition-colors duration-500 ease-smooth ${
                    isActive
                      ? "text-accent-soft"
                      : "text-ink-faint group-hover:text-accent-soft"
                  }`}
                >
                  0{i + 1}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
