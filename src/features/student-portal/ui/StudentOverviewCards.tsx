import { formatCurrency } from "@/shared/lib/formatters";

import type { TEstadoPagosEstudiante } from "../model/student-dashboard.types";
import StudentStatCard from "./StudentStatCard";
import type { IStudentOverviewCardsProps } from "./StudentOverviewCards.types";

function formatoPractica(minutos: number): string {
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const restante = minutos % 60;
    return restante > 0 ? `${horas}h ${restante}m` : `${horas}h`;
  }
  return `${minutos} min`;
}

const ESTADO_PAGOS_META: Record<TEstadoPagosEstudiante, { label: string; icon: string }> = {
  al_dia: { label: "Al día", icon: "ph:check-circle" },
  por_vencer: { label: "Por vencer", icon: "ph:clock" },
  cuota_vencida: { label: "Cuota vencida", icon: "ph:warning-circle" },
};

export default function StudentOverviewCards({ data }: IStudentOverviewCardsProps) {
  const pagos = ESTADO_PAGOS_META[data.estadoPagos];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StudentStatCard
        icon="ph:chart-line-up"
        label="Promedio académico"
        value={data.promedioSobre10 != null ? `${data.promedioSobre10.toFixed(1)} / 10` : "—"}
        helper={data.evaluacionesRendidas > 0 ? `${data.evaluacionesRendidas} evaluaciones` : "Sin evaluaciones"}
      />
      <StudentStatCard icon="ph:guitar" label="Práctica esta semana" value={formatoPractica(data.practicaSemanalMinutos)} />
      <StudentStatCard
        icon={pagos.icon}
        label="Estado de pagos"
        value={pagos.label}
        helper={data.cuotasVencidas > 0 ? `${data.cuotasVencidas} vencida(s)` : "Sin mora"}
      />
      <StudentStatCard icon="ph:receipt" label="Saldo pendiente" value={formatCurrency(data.saldoPendiente)} />
    </div>
  );
}