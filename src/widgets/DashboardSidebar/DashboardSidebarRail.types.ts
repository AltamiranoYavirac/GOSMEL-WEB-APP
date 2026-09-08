import type { TRol } from "@/entities/user";

export interface IDashboardSidebarRailProps {
  role: TRol;
  onExpand: () => void;
}
