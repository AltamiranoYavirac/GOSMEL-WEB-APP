import type { CSSProperties } from "react";

export interface IRevealImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}
