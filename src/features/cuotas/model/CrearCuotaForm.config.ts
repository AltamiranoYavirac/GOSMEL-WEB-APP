import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";

export const crearCuotaFormSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  responsableRepresentanteId: z.string().optional(),
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  fechaVencimiento: z.string().min(1, "Selecciona la fecha de vencimiento"),
  concepto: z.string().min(2, "Describe el cargo"),
});

export type ICrearCuotaFormValues = z.infer<typeof crearCuotaFormSchema>;

export function getCrearCuotaFormDefaults(): ICrearCuotaFormValues {
  const now = new Date();
  return {
    estudianteId: "",
    responsableRepresentanteId: "",
    monto: 35,
    fechaVencimiento: toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 5)),
    concepto: "",
  };
}
