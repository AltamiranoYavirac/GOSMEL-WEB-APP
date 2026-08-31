import { z } from "zod";

import type { Database } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];

export const crearCursoFormSchema = z
  .object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().min(10, "Describe el curso con al menos 10 caracteres"),
    resumen: z.string().optional(),
    nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
    modalidad: z.enum(["presencial", "virtual", "hibrido"]),
    instrumentoId: z.string().optional(),
    duracionSemanas: z.number().int().min(1, "Duración inválida").nullable().optional(),
    horasTotales: z.number().int().min(1, "Horas inválidas").nullable().optional(),
    publicado: z.boolean(),
    destacado: z.boolean(),
    asignarDocente: z.boolean(),
    docenteId: z.string().optional(),
    aula: z.string().optional(),
    cupoMaximo: z.coerce.number().int().min(0, "Ingresa un cupo válido").max(200, "Máximo 200"),
  })
  .superRefine((values, ctx) => {
    if (values.asignarDocente && !values.docenteId) {
      ctx.addIssue({ code: "custom", path: ["docenteId"], message: "Selecciona un docente" });
    }
  });

export type ICrearCursoFormValues = z.infer<typeof crearCursoFormSchema>;

export function getCrearCursoFormDefaults(): ICrearCursoFormValues {
  return {
    nombre: "",
    descripcion: "",
    resumen: "",
    nivel: "basico",
    modalidad: "presencial",
    instrumentoId: "",
    duracionSemanas: null,
    horasTotales: null,
    publicado: false,
    destacado: false,
    asignarDocente: false,
    docenteId: "",
    aula: "",
    cupoMaximo: 10,
  };
}

export interface IInstrumentoOption {
  id: string;
  nombre: string;
}

export interface IDocenteOption {
  id: string;
  nombre: string;
}

export const NIVEL_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export const MODALIDAD_OPCIONES: ISelectFieldOption[] = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];