import type { Variants } from "motion/react";

import type { TRevealVariant } from "./Reveal.types";

const OFFSET = 24;

export const REVEAL_VARIANTS: Record<TRevealVariant, Variants> = {
  rise: {
    hidden: { opacity: 0, y: OFFSET },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

export const REVEAL_TRANSITION = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;
