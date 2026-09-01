import type { ReactNode } from "react";

export interface IAdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
  children?: ReactNode;
}