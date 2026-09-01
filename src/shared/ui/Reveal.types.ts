import type { ReactNode } from "react";

export type TRevealVariant = "rise" | "left" | "right";

export type TRevealTag =
  | "div"
  | "section"
  | "article"
  | "li"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3";

export interface IRevealProps {
  children: ReactNode;
  variant?: TRevealVariant;
  delay?: number;
  as?: TRevealTag;
  className?: string;
}
