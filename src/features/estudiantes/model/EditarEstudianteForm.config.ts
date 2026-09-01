import { z } from "zod";

import type { Database } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];

export const editarEstudianteFormSchema = z.object({
  nombres: z.string().trim().min(2, "Ingresa los nombres"),
  apellidos: z.string().trim().min(2, "Ingresa los apellidos"),
  cedula: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 5, "La cédula debe tener al menos 5 dígitos"),
  celular: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\+?[1-9]\d{6,14}$/.test(value), "Ingresa un teléfono válido"),
  email: z.union([z.string().trim().email("Ingresa un correo válido"), z.literal("")]).optional(),
  fechaNacimiento: z.string().min(1, "Selecciona la fecha de nacimiento"),
  nivel: z.string().optional(),
  activo: z.boolean(),
});

export type IEditarEstudianteFormValues = z.infer<typeof editarEstudianteFormSchema>;

export function getEditarEstudianteFormDefaults(estudiante: {
  nombres: string;
  apellidos: string;
  cedula: string | null;
  celular: string | null;
  email: string | null;
  fechaNacimiento: string | null;
  nivel: string | null;
  activo: boolean;
}): IEditarEstudianteFormValues {
  return {
    nombres: estudiante.nombres,
    apellidos: estudiante.apellidos,
    cedula: estudiante.cedula ?? "",
    celular: estudiante.celular ?? "",
    email: estudiante.email ?? "",
    fechaNacimiento: estudiante.fechaNacimiento ?? "",
    nivel: estudiante.nivel ?? "",
    activo: estudiante.activo,
  };
}

export const NIVEL_ESTUDIANTE_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];