import type { ISessionUser, TRol } from "@/entities/user";

export interface IDashboardSidebarProps {
  role: TRol;
  session: ISessionUser;
  onNavigate?: () => void;
}
