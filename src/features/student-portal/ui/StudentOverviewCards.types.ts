import type { TEstadoPagosEstudiante } from "../model/student-dashboard.types";

export interface IStudentOverviewCardsProps {
  data: {
    promedioSobre10: number | null;
    evaluacionesRendidas: number;
    practicaSemanalMinutos: number;
    estadoPagos: TEstadoPagosEstudiante;
    saldoPendiente: number;
    cuotasVencidas: number;
  };
}