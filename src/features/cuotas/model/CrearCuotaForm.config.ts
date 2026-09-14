import { z } from "zod";

import { toLocalDateString } from "@/shared/lib";

export const crearCuotaFormSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  periodo: z.string().min(1, "Selecciona el período"),
  fechaVencimiento: z.string().min(1, "Selecciona la fecha de vencimiento"),
});

export type ICrearCuotaFormValues = z.infer<typeof crearCuotaFormSchema>;

export function getCrearCuotaFormDefaults(): ICrearCuotaFormValues {
  const now = new Date();
  return {
    estudianteId: "",
    monto: 35,
    periodo: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    fechaVencimiento: toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 5)),
  };
}
