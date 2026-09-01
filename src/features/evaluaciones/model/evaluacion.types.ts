import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TTipoEvaluacion = Database["public"]["Enums"]["tipo_evaluacion"];

export interface IEvaluacionRow {
  id: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  catedra: string;
  curso: string;
  fecha: string | null;
  ponderacion: number;
  notaMaxima: number;
  promedio: number | null;
  rendidas: number;
}

export const TIPO_EVALUACION_BADGE: Record<TTipoEvaluacion, { label: string; variant: TBadgeVariant }> = {
  diagnostica: { label: "Diagnóstica", variant: "outline" },
  formativa: { label: "Formativa", variant: "secondary" },
  sumativa: { label: "Sumativa", variant: "default" },
  recital: { label: "Recital", variant: "ghost" },
  examen_practico: { label: "Examen práctico", variant: "default" },
  examen_teorico: { label: "Examen teórico", variant: "outline" },
};