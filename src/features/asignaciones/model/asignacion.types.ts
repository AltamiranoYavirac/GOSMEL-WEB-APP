import type { TBadgeVariant } from "@/shared/ui";
import type { TEstadoCatedra } from "@/entities/catedra";

export interface IAsignacionDocente {
  id: string;
  nombre: string;
  instrumentoIds: string[];
}

export interface IAsignacionRow {
  catedraId: string;
  codigo: string;
  curso: string;
  instrumentoId: string | null;
  instrumento: string | null;
  docenteId: string;
  docente: string | null;
  estudiantesActivos: number;
  sesiones: number;
  estado: TEstadoCatedra;
}

export interface IAsignacionesData {
  catedras: IAsignacionRow[];
  docentes: IAsignacionDocente[];
}

export const ASIGNACION_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};
