import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];

export interface IProgramaRow {
  id: string;
  nombre: string;
  nivel: TNivelCurso | null;
  instrumento: string | null;
  numCursos: number;
  publicado: boolean;
}

export const NIVEL_BADGE: Record<TNivelCurso, { label: string; variant: TBadgeVariant }> = {
  iniciacion: { label: "Iniciación", variant: "secondary" },
  basico: { label: "Básico", variant: "outline" },
  intermedio: { label: "Intermedio", variant: "default" },
  avanzado: { label: "Avanzado", variant: "default" },
  maestria: { label: "Maestría", variant: "ghost" },
};