import { z } from "zod";

export const generarSesionesCatedraFormSchema = z.object({
  fechaDesde: z.string().min(1, "Selecciona la fecha de inicio"),
  fechaHasta: z.string().min(1, "Selecciona la fecha de fin"),
});

export type IGenerarSesionesCatedraFormValues = z.infer<typeof generarSesionesCatedraFormSchema>;

export function getGenerarSesionesCatedraFormDefaults(): IGenerarSesionesCatedraFormValues {
  const desde = new Date();
  const hasta = new Date();
  hasta.setMonth(hasta.getMonth() + 4);
  return {
    fechaDesde: desde.toISOString().slice(0, 10),
    fechaHasta: hasta.toISOString().slice(0, 10),
  };
}
