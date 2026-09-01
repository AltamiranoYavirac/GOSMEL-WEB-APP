import { z } from "zod";

import type { Database } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];

export const asignarEstudianteFormSchema = z.object({
  fechaNacimiento: z.string().min(1, "Selecciona la fecha de nacimiento"),
  nivel: z.string().optional(),
});

export type IAsignarEstudianteFormValues = z.infer<typeof asignarEstudianteFormSchema>;

export function getAsignarEstudianteFormDefaults(): IAsignarEstudianteFormValues {
  return { fechaNacimiento: "", nivel: "" };
}

export const NIVEL_ESTUDIANTE_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];