import { z } from "zod";

import type { Database } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TParentesco = Database["public"]["Enums"]["parentesco"];

export const crearMatriculaFormSchema = z.object({
  catedraId: z.string().min(1, "Selecciona una cátedra"),
  nombres: z.string().trim().min(2, "Ingresa los nombres"),
  apellidos: z.string().trim().min(2, "Ingresa los apellidos"),
  fechaNacimiento: z.string().min(1, "Selecciona la fecha de nacimiento"),
  paraMenor: z.boolean(),
  parentesco: z.enum(["madre", "padre", "abuelo", "tio", "hermano", "tutor_legal", "otro"]),
});

export type ICrearMatriculaFormValues = z.infer<typeof crearMatriculaFormSchema>;

export function getCrearMatriculaFormDefaults(): ICrearMatriculaFormValues {
  return {
    catedraId: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    paraMenor: false,
    parentesco: "otro",
  };
}

export const PARENTESCO_OPCIONES: ISelectFieldOption[] = [
  { value: "madre", label: "Madre" },
  { value: "padre", label: "Padre" },
  { value: "abuelo", label: "Abuelo/a" },
  { value: "tio", label: "Tío/a" },
  { value: "hermano", label: "Hermano/a" },
  { value: "tutor_legal", label: "Tutor legal" },
  { value: "otro", label: "Otro" },
];