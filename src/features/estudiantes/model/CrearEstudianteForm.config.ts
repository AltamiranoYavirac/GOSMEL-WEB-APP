import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

import type { ICreateEstudianteInput } from "../api/createEstudiante";
import type { TNivelCurso, TParentesco } from "./estudiante.types";

export const NIVEL_ESTUDIANTE_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export const PARENTESCO_OPCIONES: ISelectFieldOption[] = [
  { value: "madre", label: "Madre" },
  { value: "padre", label: "Padre" },
  { value: "abuelo", label: "Abuelo/a" },
  { value: "tio", label: "Tío/a" },
  { value: "hermano", label: "Hermano/a" },
  { value: "tutor_legal", label: "Tutor Legal" },
  { value: "otro", label: "Otro" },
];

export const crearEstudianteFormSchema = z
  .object({
    nombres: z.string().trim().min(2, "Ingresa los nombres"),
    apellidos: z.string().trim().min(2, "Ingresa los apellidos"),
    fechaNacimiento: z.string().min(1, "Selecciona la fecha de nacimiento"),
    nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]),
    cedula: z.string().trim().optional(),
    celular: z.string().trim().optional(),
    email: z.union([z.string().trim().email("Ingresa un correo válido"), z.literal("")]).optional(),
    esMenor: z.boolean(),
    representanteId: z.string().optional(),
    parentesco: z.enum(["madre", "padre", "abuelo", "tio", "hermano", "tutor_legal", "otro"]),
  })
  .superRefine((values, ctx) => {
    if (values.esMenor && !values.representanteId) {
      ctx.addIssue({ code: "custom", path: ["representanteId"], message: "Selecciona un representante" });
    }
  });

export type ICrearEstudianteFormValues = z.infer<typeof crearEstudianteFormSchema>;

export function getCrearEstudianteFormDefaults(
  defaultRepresentanteId?: string
): ICrearEstudianteFormValues {
  return {
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    nivel: "iniciacion",
    cedula: "",
    celular: "",
    email: "",
    esMenor: true,
    representanteId: defaultRepresentanteId ?? "",
    parentesco: "madre",
  };
}

export function buildCrearEstudiantePayload(values: ICrearEstudianteFormValues): ICreateEstudianteInput {
  const asociaRepresentante = values.esMenor && Boolean(values.representanteId);
  return {
    nombres: values.nombres,
    apellidos: values.apellidos,
    fecha_nacimiento: values.fechaNacimiento,
    cedula: values.cedula || undefined,
    celular: values.celular || undefined,
    email: values.email || undefined,
    nivel_musical: values.nivel as TNivelCurso,
    representante_id: asociaRepresentante ? values.representanteId : undefined,
    parentesco: asociaRepresentante ? (values.parentesco as TParentesco) : undefined,
  };
}
