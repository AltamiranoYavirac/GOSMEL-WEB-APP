import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

export const editarCatedraFormSchema = z.object({
  cupoMaximo: z.coerce.number().int().min(1, "Ingresa un cupo válido").max(200, "Máximo 200"),
  aula: z.string().optional(),
  modalidad: z.enum(["presencial", "virtual", "hibrido"]),
  docenteId: z.string().optional(),
  estado: z.enum(["planificada", "en_curso", "finalizada", "cancelada"]),
});

export type IEditarCatedraFormValues = z.infer<typeof editarCatedraFormSchema>;

export function getEditarCatedraFormDefaults(initial?: Partial<IEditarCatedraFormValues>): IEditarCatedraFormValues {
  return {
    cupoMaximo: initial?.cupoMaximo ?? 15,
    aula: initial?.aula ?? "",
    modalidad: initial?.modalidad ?? "presencial",
    docenteId: initial?.docenteId ?? "",
    estado: initial?.estado ?? "planificada",
  };
}

export const MODALIDAD_OPCIONES: ISelectFieldOption[] = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
];

export const ESTADO_CATEDRA_OPCIONES: ISelectFieldOption[] = [
  { value: "planificada", label: "Planificada" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
];