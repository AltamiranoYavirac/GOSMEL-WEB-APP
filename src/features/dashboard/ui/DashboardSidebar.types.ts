import type {
  IDashboardTip,
  IDashboardEvent,
  IDashboardRecommended,
} from "../model/dashboard.types";

export interface IDashboardSidebarProps {
  tips: IDashboardTip[];
  events: IDashboardEvent[];
  recommended: IDashboardRecommended[];
}