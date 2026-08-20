import { env } from "@/shared/config/env";

import { getMockDashboardOverview } from "../model/dashboard-overview.mock";
import { getDashboardOverview } from "./getDashboardOverview";
import type { IDashboardOverview } from "../model/dashboard-overview.types";

export async function loadDashboardOverview(): Promise<{
  data: IDashboardOverview | null;
  error: string | null;
}> {
  if (env.useMockData) {
    return getMockDashboardOverview();
  }
  return getDashboardOverview();
}
