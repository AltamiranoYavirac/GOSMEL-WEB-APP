import type { TRol } from "@/entities/user";

export interface IDashboardSidebarProps {
  role: TRol;
  onNavigate?: () => void;
}
