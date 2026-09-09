import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";

import type { IInscribirEstudianteCatedraInput } from "../api/inscribirEstudianteCatedra";

export const DIA_COBRO_OPCIONES: ISelectFieldOption[] = [
  { value: "1", label: "Día 1 de cada mes" },
  { value: "5", label: "Día 5 de cada mes" },
  { value: "10", label: "Día 10 de cada mes" },
  { value: "15", label: "Día 15 de cada mes" },
  { value: "20", label: "Día 20 de cada mes" },
];

export const asignarCursoEstudianteFormSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  catedraId: z.string().min(1, "Selecciona una cátedra"),
  montoMensual: z.coerce.number().positive("Ingresa una mensualidad válida"),
  diaCobro: z.enum(["1", "5", "10", "15", "20"]),
  motivoAjuste: z.string().trim().optional(),
});

export type IAsignarCursoEstudianteFormValues = z.infer<typeof asignarCursoEstudianteFormSchema>;

export function getAsignarCursoEstudianteFormDefaults(
  estudianteId?: string
): IAsignarCursoEstudianteFormValues {
  return {
    estudianteId: estudianteId ?? "",
    catedraId: "",
    montoMensual: 45,
    diaCobro: "5",
    motivoAjuste: "",
  };
}

export function buildAsignarCursoEstudiantePayload(
  values: IAsignarCursoEstudianteFormValues
): IInscribirEstudianteCatedraInput {
  return {
    estudianteId: values.estudianteId,
    catedraId: values.catedraId,
    montoMensual: values.montoMensual,
    diaCobro: Number(values.diaCobro),
    motivoAjuste: values.motivoAjuste?.trim() || undefined,
  };
}
