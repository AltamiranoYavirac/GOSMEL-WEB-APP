import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TEstadoSesion = Database["public"]["Enums"]["estado_sesion"];
export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];
export type TVisibilidadMaterial = Database["public"]["Enums"]["visibilidad_material"];
export type TTipoEvaluacion = Database["public"]["Enums"]["tipo_evaluacion"];

export interface ITeacherHorario {
  dia: number;
  inicio: string;
  fin: string;
}

export interface ITeacherCatedra {
  id: string;
  codigo: string;
  curso: string;
  modalidad: TModalidadCurso;
  aula: string | null;
  cupoMaximo: number;
  inscritos: number;
  estado: TEstadoCatedra;
  horarios: ITeacherHorario[];
}

export interface ITeacherSesion {
  id: string;
  catedra: string;
  curso: string;
  fecha: string;
  inicio: string;
  fin: string;
  tema: string | null;
  presentes: number;
  totalAsistencia: number;
  estado: TEstadoSesion;
}

export interface ITeacherMaterial {
  id: string;
  titulo: string;
  tipo: TTipoMaterial;
  visibilidad: TVisibilidadMaterial;
  destino: string | null;
}

export interface ITeacherEvaluacion {
  id: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  catedra: string;
  fecha: string | null;
  ponderacion: number;
  notaMaxima: number;
  promedio: number | null;
  rendidas: number;
}

export interface ITeacherDashboard {
  nombre: string;
  counts: {
    catedrasActivas: number;
    sesionesHoy: number;
    inscritos: number;
  };
  catedras: ITeacherCatedra[];
  sesiones: ITeacherSesion[];
  materiales: ITeacherMaterial[];
  evaluaciones: ITeacherEvaluacion[];
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

export const SESION_ESTADO_BADGE: Record<TEstadoSesion, { label: string; variant: TBadgeVariant }> = {
  programada: { label: "Programada", variant: "outline" },
  realizada: { label: "Realizada", variant: "default" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  reprogramada: { label: "Reprogramada", variant: "secondary" },
};

export const MATERIAL_TIPO_BADGE: Record<TTipoMaterial, { label: string; variant: TBadgeVariant }> = {
  pdf: { label: "PDF", variant: "outline" },
  audio: { label: "Audio", variant: "secondary" },
  video: { label: "Video", variant: "default" },
  partitura: { label: "Partitura", variant: "default" },
  enlace: { label: "Enlace", variant: "ghost" },
};

export const EVALUACION_TIPO_BADGE: Record<TTipoEvaluacion, { label: string; variant: TBadgeVariant }> = {
  diagnostica: { label: "Diagnóstica", variant: "outline" },
  formativa: { label: "Formativa", variant: "secondary" },
  sumativa: { label: "Sumativa", variant: "default" },
  recital: { label: "Recital", variant: "ghost" },
  examen_practico: { label: "Examen práctico", variant: "default" },
  examen_teorico: { label: "Examen teórico", variant: "outline" },
};