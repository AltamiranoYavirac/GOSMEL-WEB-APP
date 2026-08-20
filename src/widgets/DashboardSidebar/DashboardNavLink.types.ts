import type { IDashboardNavItem } from "@/entities/user";

export interface IDashboardNavLinkProps {
  item: IDashboardNavItem;
  onNavigate?: () => void;
}
