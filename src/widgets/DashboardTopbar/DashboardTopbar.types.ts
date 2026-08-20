import type { TRol } from "@/entities/user";

export interface IDashboardTopbarProps {
  role: TRol;
  onMenuClick: () => void;
}
