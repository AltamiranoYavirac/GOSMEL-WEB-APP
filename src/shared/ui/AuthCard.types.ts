import type { ReactNode } from "react";

export interface IAuthCardProps {
  icon: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}
