import { Icon } from "@iconify/react";

import { getDashboardOverview } from "../api/getDashboardOverview";
import DashboardWelcome from "./DashboardWelcome";
import InstrumentDemandChart from "./InstrumentDemandChart";
import KpiCardGrid from "./KpiCardGrid";
import RecentActivityList from "./RecentActivityList";
import RevenueChart from "./RevenueChart";
import SolicitudesStatusChart from "./SolicitudesStatusChart";

export default async function DashboardOverview() {
  const { data, error } = await getDashboardOverview();

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <Icon icon="ph:warning-circle" width={32} height={32} className="text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">No se pudieron cargar los indicadores. Intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardWelcome adminName={data.adminName} solicitudesPendientes={data.solicitudesPendientes} />

      <KpiCardGrid kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={data.revenue} />
        </div>
        <SolicitudesStatusChart data={data.solicitudesPorEstado} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InstrumentDemandChart data={data.instrumentosDemandados} />
        <RecentActivityList
          title="Solicitudes recientes"
          emptyText="Aún no han llegado solicitudes."
          items={data.solicitudesRecientes}
          viewAllHref="/dashboard/admin/solicitudes"
        />
        <RecentActivityList
          title="Pagos recientes"
          emptyText="Aún no se han registrado pagos."
          items={data.pagosRecientes}
          viewAllHref="/dashboard/admin/pagos"
        />
      </div>
    </div>
  );
}
