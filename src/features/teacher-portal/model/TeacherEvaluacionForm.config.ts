import { z } from "zod";

import type { TTipoEvaluacion } from "./teacher-dashboard.types";

export const EVALUACION_TIPO_OPCIONES: { value: TTipoEvaluacion; label: string }[] = [
  { value: "diagnostica", label: "Diagnóstica" },
  { value: "formativa", label: "Formativa" },
  { value: "sumativa", label: "Sumativa" },
  { value: "recital", label: "Recital" },
  { value: "examen_practico", label: "Examen Práctico" },
  { value: "examen_teorico", label: "Examen Teórico" },
];

export const teacherEvaluacionFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  tipo: z.enum(["diagnostica", "formativa", "sumativa", "recital", "examen_practico", "examen_teorico"]),
  fecha: z.string().min(1, "Debe seleccionar la fecha"),
  notaMaxima: z.number().min(1, "La nota máxima debe ser mayor a 0").max(100, "Máximo 100"),
  ponderacion: z.number().min(1, "La ponderación debe ser mayor a 0%").max(100, "Máximo 100%"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
});

export type ITeacherEvaluacionFormValues = z.infer<typeof teacherEvaluacionFormSchema>;

export function getTeacherEvaluacionFormDefaults(defaultCatedraId = ""): ITeacherEvaluacionFormValues {
  return {
    catedraId: defaultCatedraId,
    titulo: "",
    tipo: "sumativa",
    fecha: new Date().toISOString().slice(0, 10),
    notaMaxima: 10,
    ponderacion: 20,
    descripcion: "",
  };
}

export function buildTeacherEvaluacionPayload(values: ITeacherEvaluacionFormValues, userId: string) {
  return {
    catedra_id: values.catedraId,
    titulo: values.titulo.trim(),
    tipo: values.tipo,
    fecha: values.fecha,
    nota_maxima: values.notaMaxima,
    ponderacion: values.ponderacion,
    descripcion: values.descripcion?.trim() || null,
    creada_por: userId,
  };
}
