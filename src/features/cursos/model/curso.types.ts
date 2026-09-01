import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];

export interface ICursoRow {
  id: string;
  nombre: string;
  nivel: TNivelCurso;
  modalidad: TModalidadCurso;
  instrumento: string | null;
  rating: number;
  totalResenas: number;
  modulos: number;
  destacado: boolean;
  publicado: boolean;
}

export const NIVEL_BADGE: Record<TNivelCurso, { label: string; variant: TBadgeVariant }> = {
  iniciacion: { label: "Iniciación", variant: "secondary" },
  basico: { label: "Básico", variant: "outline" },
  intermedio: { label: "Intermedio", variant: "default" },
  avanzado: { label: "Avanzado", variant: "default" },
  maestria: { label: "Maestría", variant: "ghost" },
};

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};