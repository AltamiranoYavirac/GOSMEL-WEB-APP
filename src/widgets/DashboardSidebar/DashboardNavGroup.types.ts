import type { IDashboardNavGroup } from "@/entities/user";

export interface IDashboardNavGroupProps {
  group: IDashboardNavGroup;
  isOpen: boolean;
  hasActiveChild: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}
