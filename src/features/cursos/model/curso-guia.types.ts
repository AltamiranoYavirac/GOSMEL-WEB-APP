import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];

export interface ICursoGuiaLeccion {
  id: string;
  titulo: string;
  descripcion: string | null;
  duracionMinutos: number | null;
}

export interface ICursoGuiaModulo {
  id: string;
  titulo: string;
  descripcion: string | null;
  lecciones: ICursoGuiaLeccion[];
}

export interface ICursoGuiaCatedra {
  id: string;
  codigo: string;
  modalidad: TModalidadCurso;
  estado: TEstadoCatedra;
  docente: string | null;
}

export interface ICursoGuia {
  id: string;
  nombre: string;
  descripcion: string;
  resumen: string | null;
  nivel: TNivelCurso;
  modalidad: TModalidadCurso;
  duracionSemanas: number | null;
  horasTotales: number | null;
  modulos: ICursoGuiaModulo[];
  catedras: ICursoGuiaCatedra[];
}

export const CATEDRA_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};