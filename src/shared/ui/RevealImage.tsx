"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { REVEAL_VIEWPORT } from "./Reveal.variants";
import type { IRevealImageProps } from "./RevealImage.types";

export default function RevealImage({
  src,
  alt,
  sizes,
  className,
  style,
  priority,
  fetchPriority,
}: IRevealImageProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0"
      initial={reduced ? undefined : { scale: 1.06 }}
      whileInView={reduced ? undefined : { scale: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        className={className}
        style={style}
      />
    </motion.div>
  );
}
