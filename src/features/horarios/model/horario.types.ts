import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoSesion = Database["public"]["Enums"]["estado_sesion"];

export interface IHorarioRecurrenteRow {
  id: string;
  catedra: string;
  curso: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface ISesionRow {
  id: string;
  catedra: string;
  curso: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tema: string | null;
  presentes: number;
  totalAsistencia: number;
  estado: TEstadoSesion;
}

export const DIAS_SEMANA: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export const SESION_ESTADO_BADGE: Record<TEstadoSesion, { label: string; variant: TBadgeVariant }> = {
  programada: { label: "Programada", variant: "outline" },
  realizada: { label: "Realizada", variant: "default" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  reprogramada: { label: "Reprogramada", variant: "secondary" },
};