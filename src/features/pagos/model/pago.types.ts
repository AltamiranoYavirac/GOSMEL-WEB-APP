import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoPago = "pendiente_verificacion" | "aprobado" | "rechazado";

export interface IPagoRow {
  id: string;
  fechaPago: string;
  estudiante: string;
  periodo: string | null;
  monto: number;
  metodo: string | null;
  referencia: string | null;
  observacion: string | null;
  comprobanteStoragePath: string | null;
  estado: TEstadoPago;
}

export const PAGO_ESTADO_BADGE: Record<TEstadoPago, { label: string; variant: TBadgeVariant }> = {
  pendiente_verificacion: { label: "Por verificar", variant: "warning" },
  aprobado: { label: "Aprobado", variant: "success" },
  rechazado: { label: "Rechazado", variant: "destructive" },
};