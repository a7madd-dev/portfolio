"use client";

import { motion, type HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  /** Pull ratio — how much of the cursor's offset the button tracks. */
  strength?: number;
  /** Max absolute translation in px; clamps the pull on wide buttons. */
  max?: number;
} & Omit<HTMLMotionProps<"button">, "ref">;

/**
 * Subtle magnetic pull — translates toward the cursor while hovered.
 * Uses springs (not tween) so movement feels physical, not scripted.
 *
 * Defaults tuned for a restrained, premium feel: strength 0.22 with an 18px
 * clamp. Higher ratios look gimmicky; the return is slightly firmer than the
 * pull so the button settles cleanly.
 */
const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  {
    children,
    strength = 0.22,
    max = 18,
    className = "",
    onMouseMove,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Firmer settle than pull — arrives calmly, no rebound.
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    // Touch / coarse pointer devices: no magnetic effect — it only confuses tap.
    const hoverOk = window.matchMedia("(hover: hover)").matches;
    const fineOk = window.matchMedia("(pointer: fine)").matches;
    setEnabled(hoverOk && fineOk);
  }, []);

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    const el = innerRef.current;
    if (!el || !enabled) {
      onMouseMove?.(event);
      return;
    }
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    const dx = Math.max(-max, Math.min(max, relX * strength));
    const dy = Math.max(-max, Math.min(max, relY * strength));
    x.set(dx);
    y.set(dy);
    onMouseMove?.(event);
  }

  function handleLeave(event: MouseEvent<HTMLButtonElement>) {
    x.set(0);
    y.set(0);
    onMouseLeave?.(event);
  }

  return (
    <motion.button
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ x: sx, y: sy, willChange: "transform" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export default MagneticButton;
