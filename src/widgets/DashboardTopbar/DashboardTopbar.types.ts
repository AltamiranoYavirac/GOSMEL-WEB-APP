import type { TRol } from "@/entities/user";
import type { ISessionUser } from "@/entities/user";

export interface IDashboardTopbarProps {
  role: TRol;
  session: ISessionUser;
  onMenuClick: () => void;
  onToggleSidebar?: () => void;
}
