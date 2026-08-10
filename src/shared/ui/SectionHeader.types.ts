import type { ReactNode } from "react";

export interface ISectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  size?: "sm" | "md" | "lg";
  lineAccent?: boolean;
  className?: string;
}
