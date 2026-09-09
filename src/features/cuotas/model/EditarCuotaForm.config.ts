import { z } from "zod";

import type { ICuotaRow } from "./cuota.types";

export const editarCuotaFormSchema = z.object({
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  fechaVencimiento: z.string().min(1, "Selecciona la fecha de vencimiento"),
});

export type IEditarCuotaFormValues = z.infer<typeof editarCuotaFormSchema>;

export function mapCuotaToFormValues(cuota: ICuotaRow): IEditarCuotaFormValues {
  return {
    monto: cuota.monto,
    fechaVencimiento: cuota.fechaVencimiento ?? "",
  };
}
