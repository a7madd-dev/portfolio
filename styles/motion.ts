import type { Transition, Variants } from "framer-motion";

// Single canonical easing curve used across the whole experience.
// Applied consistently so transitions feel part of one system.
export const ease = [0.22, 1, 0.36, 1] as const;

// Soft natural spring — the default for layout & shared-element transitions.
export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

// Snappier spring for micro-interactions (hover, tap).
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.6,
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease },
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease },
  },
};

export const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
