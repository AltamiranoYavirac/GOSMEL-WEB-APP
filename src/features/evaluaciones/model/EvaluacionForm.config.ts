import { z } from "zod";

import type { TTipoEvaluacion } from "./evaluacion.types";

export const evaluacionFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  titulo: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  tipo: z.enum([
    "diagnostica",
    "formativa",
    "sumativa",
    "recital",
    "examen_practico",
    "examen_teorico",
  ]).default("formativa"),
  descripcion: z.string().optional(),
  fecha: z.string().optional(),
  notaMaxima: z.number().positive("La nota máxima debe ser mayor a 0").default(10),
  ponderacion: z.number().min(0).max(100).default(20),
});

export type IEvaluacionFormValues = z.infer<typeof evaluacionFormSchema>;

export function getEvaluacionFormDefaults(initial?: Partial<IEvaluacionFormValues>): IEvaluacionFormValues {
  return {
    catedraId: initial?.catedraId ?? "",
    titulo: initial?.titulo ?? "",
    tipo: (initial?.tipo as TTipoEvaluacion) ?? "formativa",
    descripcion: initial?.descripcion ?? "",
    fecha: initial?.fecha ?? new Date().toISOString().slice(0, 10),
    notaMaxima: initial?.notaMaxima ?? 10,
    ponderacion: initial?.ponderacion ?? 20,
  };
}

export const TIPO_EVALUACION_OPCIONES = [
  { value: "diagnostica", label: "Diagnóstica" },
  { value: "formativa", label: "Formativa" },
  { value: "sumativa", label: "Sumativa" },
  { value: "examen_practico", label: "Examen práctico" },
  { value: "examen_teorico", label: "Examen teórico" },
  { value: "recital", label: "Recital" },
];
