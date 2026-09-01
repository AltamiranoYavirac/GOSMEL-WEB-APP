import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TEstadoInscripcion = Database["public"]["Enums"]["estado_inscripcion"];
export type TEstadoCuota = Database["public"]["Enums"]["estado_cuota"];
export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];

export interface IStudentHorario {
  dia: number;
  inicio: string;
  fin: string;
}

export interface IStudentInscripcion {
  id: string;
  catedra: string;
  curso: string;
  estado: TEstadoInscripcion;
  horarios: IStudentHorario[];
}

export interface IStudentCuota {
  id: string;
  periodo: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  fechaVencimiento: string | null;
  estado: TEstadoCuota;
}

export interface IStudentData {
  id: string;
  nombre: string;
  inscripciones: IStudentInscripcion[];
  cuotas: IStudentCuota[];
}

export interface IStudentMaterial {
  id: string;
  titulo: string;
  tipo: TTipoMaterial;
  destino: string | null;
}

export interface IStudentDashboard {
  nombre: string;
  estudiantes: IStudentData[];
  materiales: IStudentMaterial[];
  counts: {
    inscripcionesActivas: number;
    saldoTotal: number;
    cuotasVencidas: number;
  };
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

export const INSCRIPCION_ESTADO_BADGE: Record<TEstadoInscripcion, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  activa: { label: "Activa", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  retirada: { label: "Retirada", variant: "destructive" },
};

export const CUOTA_ESTADO_BADGE: Record<TEstadoCuota, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  parcial: { label: "Parcial", variant: "outline" },
  pagada: { label: "Pagada", variant: "default" },
  condonada: { label: "Condonada", variant: "ghost" },
};

export const MATERIAL_TIPO_BADGE: Record<TTipoMaterial, { label: string; variant: TBadgeVariant }> = {
  pdf: { label: "PDF", variant: "outline" },
  audio: { label: "Audio", variant: "secondary" },
  video: { label: "Video", variant: "default" },
  partitura: { label: "Partitura", variant: "default" },
  enlace: { label: "Enlace", variant: "ghost" },
};