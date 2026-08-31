import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];

export interface ICatedraRow {
  id: string;
  codigo: string;
  curso: string;
  docente: string | null;
  modalidad: TModalidadCurso;
  aula: string | null;
  cupoMaximo: number;
  activos: number;
  pendientes: number;
  estado: TEstadoCatedra;
}

export const CATEDRA_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};