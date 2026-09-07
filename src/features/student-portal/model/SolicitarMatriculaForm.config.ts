import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

export const solicitarMatriculaFormSchema = z
  .object({
    catedraId: z.string().min(1, "Selecciona una cátedra"),
    paraMenor: z.boolean(),
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    fechaNacimiento: z.string().optional(),
    parentesco: z.string().optional(),
  })
  .refine((values) => !values.paraMenor || Boolean(values.nombres?.trim()), {
    message: "Ingresa el nombre del estudiante",
    path: ["nombres"],
  })
  .refine((values) => !values.paraMenor || Boolean(values.apellidos?.trim()), {
    message: "Ingresa el apellido del estudiante",
    path: ["apellidos"],
  })
  .refine((values) => !values.paraMenor || Boolean(values.fechaNacimiento), {
    message: "Ingresa la fecha de nacimiento",
    path: ["fechaNacimiento"],
  })
  .refine((values) => !values.paraMenor || Boolean(values.parentesco), {
    message: "Selecciona el parentesco",
    path: ["parentesco"],
  });

export type ISolicitarMatriculaFormValues = z.infer<typeof solicitarMatriculaFormSchema>;

export function getSolicitarMatriculaFormDefaults(): ISolicitarMatriculaFormValues {
  return {
    catedraId: "",
    paraMenor: false,
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    parentesco: "",
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