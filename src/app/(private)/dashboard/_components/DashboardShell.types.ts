import type { ReactNode } from "react";
import type { TRol } from "@/entities/user";
import type { ISessionUser } from "@/entities/user";

export interface IDashboardShellProps {
  role: TRol;
  session: ISessionUser;
  children: ReactNode;
}
