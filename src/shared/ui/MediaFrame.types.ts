import type { ReactNode } from "react";

export interface IMediaFrameProps {
  variant?: "video" | "image";
  src: string;
  alt: string;
  poster?: string;
  aspect?: "video" | "portrait" | "tall" | "fixed";
  sizes?: string;
  className?: string;
  children?: ReactNode;
}
