"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  REVEAL_TRANSITION,
  REVEAL_VARIANTS,
  REVEAL_VIEWPORT,
} from "./Reveal.variants";
import type { IRevealProps } from "./Reveal.types";

export default function Reveal({
  children,
  variant = "rise",
  delay = 0,
  as = "div",
  className,
}: IRevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={className}
      variants={REVEAL_VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </Component>
  );
}
