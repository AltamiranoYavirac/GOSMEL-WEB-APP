import type { IRecentActivityItem } from "../model/dashboard-overview.types";

export interface IRecentActivityListProps {
  title: string;
  emptyText: string;
  items: IRecentActivityItem[];
  viewAllHref?: string;
}
