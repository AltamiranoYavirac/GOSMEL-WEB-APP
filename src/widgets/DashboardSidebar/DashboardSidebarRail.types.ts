import type { ISessionUser, TRol } from "@/entities/user";

export interface IDashboardSidebarRailProps {
  role: TRol;
  session: ISessionUser;
  onExpand: () => void;
}
