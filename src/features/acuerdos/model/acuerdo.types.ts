import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoAcuerdo = Database["public"]["Enums"]["estado_acuerdo"];

export interface IAcuerdoRow {
  id: string;
  estudiante: string;
  montoMensual: number;
  moneda: string;
  diaCobro: number | null;
  fechaInicio: string;
  fechaFin: string | null;
  motivoAjuste: string | null;
  observaciones: string | null;
  inscripcion: string | null;
  estado: TEstadoAcuerdo;
}

export const ACUERDO_ESTADO_BADGE: Record<TEstadoAcuerdo, { label: string; variant: TBadgeVariant }> = {
  vigente: { label: "Vigente", variant: "default" },
  suspendido: { label: "Suspendido", variant: "secondary" },
  finalizado: { label: "Finalizado", variant: "ghost" },
};