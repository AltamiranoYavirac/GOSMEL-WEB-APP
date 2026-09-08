import KpiCard from "./KpiCard";
import type { IKpiCardGridProps } from "./KpiCardGrid.types";

export default function KpiCardGrid({ kpis }: IKpiCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}
