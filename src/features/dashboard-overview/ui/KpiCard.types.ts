import type { IDashboardKpi } from "../model/dashboard-overview.types";

export interface IKpiCardProps {
  kpi: IDashboardKpi;
  variant?: "hero" | "compact";
}
