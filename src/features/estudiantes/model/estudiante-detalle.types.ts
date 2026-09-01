import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoInscripcion = Database["public"]["Enums"]["estado_inscripcion"];
export type TEstadoCuota = Database["public"]["Enums"]["estado_cuota"];

export interface IInscripcionDetalle {
  id: string;
  catedra: string;
  curso: string;
  docenteNombre?: string | null;
  estado: TEstadoInscripcion;
}

export interface ICuotaDetalle {
  id: string;
  periodo: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  fechaVencimiento: string | null;
  estado: TEstadoCuota;
}

export interface IEstudianteDetalle {
  id: string;
  nombre: string;
  email: string | null;
  cedula: string | null;
  celular: string | null;
  fechaNacimiento: string | null;
  activo: boolean;
  instrumentos: string[];
  representante: string | null;
  inscripciones: IInscripcionDetalle[];
  cuotas: ICuotaDetalle[];
}

export const INSCRIPCION_ESTADO_BADGE: Record<TEstadoInscripcion, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  activa: { label: "Activa", variant: "success" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  retirada: { label: "Retirada", variant: "destructive" },
};

export const CUOTA_ESTADO_BADGE: Record<TEstadoCuota, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  parcial: { label: "Parcial", variant: "outline" },
  pagada: { label: "Pagada", variant: "success" },
  condonada: { label: "Condonada", variant: "ghost" },
};