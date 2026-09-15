import type { TEstadoAsistencia } from "./asistencia.types";

export interface IEstadoAsistenciaOpcion {
  value: TEstadoAsistencia;
  label: string;
  icon: string;
  activeClass: string;
}

export const ESTADOS_ASISTENCIA: IEstadoAsistenciaOpcion[] = [
  {
    value: "presente",
    label: "Presente",
    icon: "ph:check-circle-bold",
    activeClass: "bg-success text-surface-dark-foreground shadow-xs",
  },
  {
    value: "atraso",
    label: "Atraso",
    icon: "ph:clock-countdown-bold",
    activeClass: "bg-warning text-surface-dark-foreground shadow-xs",
  },
  {
    value: "justificado",
    label: "Justificado",
    icon: "ph:file-text-bold",
    activeClass: "bg-info text-surface-dark-foreground shadow-xs",
  },
  {
    value: "ausente",
    label: "Ausente",
    icon: "ph:x-circle-bold",
    activeClass: "bg-destructive text-destructive-foreground shadow-xs",
  },
];
