import type { ReactNode } from "react";
import type { TRol } from "@/entities/user";

export interface IDashboardShellProps {
  role: TRol;
  children: ReactNode;
}
