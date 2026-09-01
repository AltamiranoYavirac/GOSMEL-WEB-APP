import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoCuota = Database["public"]["Enums"]["estado_cuota"];

export interface ICuotaRow {
  id: string;
  periodo: string;
  estudiante: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  fechaVencimiento: string | null;
  estado: TEstadoCuota;
}

export const CUOTA_ESTADO_BADGE: Record<TEstadoCuota, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  parcial: { label: "Parcial", variant: "outline" },
  pagada: { label: "Pagada", variant: "success" },
  condonada: { label: "Condonada", variant: "ghost" },
};