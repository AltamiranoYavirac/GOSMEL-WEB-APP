import KpiCard from "./KpiCard";
import type { IKpiCardGridProps } from "./KpiCardGrid.types";

export default function KpiCardGrid({ kpis }: IKpiCardGridProps) {
  const hero = kpis.slice(0, 4);
  const compact = kpis.slice(4);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hero.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} variant="hero" />
        ))}
      </div>

      {compact.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {compact.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} variant="compact" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
