import { z } from "zod";

export const generarSesionesCatedraFormSchema = z
  .object({
    catedraId: z.string().min(1, "Selecciona una cátedra"),
    fechaDesde: z.string().min(1, "Selecciona la fecha de inicio"),
    fechaHasta: z.string().min(1, "Selecciona la fecha de fin"),
  })
  .superRefine((values, ctx) => {
    if (values.fechaHasta < values.fechaDesde) {
      ctx.addIssue({ code: "custom", path: ["fechaHasta"], message: "La fecha final debe ser posterior al inicio" });
    }
  });

export type IGenerarSesionesCatedraFormValues = z.infer<typeof generarSesionesCatedraFormSchema>;

export function getGenerarSesionesCatedraFormDefaults(
  initial?: Partial<IGenerarSesionesCatedraFormValues>
): IGenerarSesionesCatedraFormValues {
  return {
    catedraId: initial?.catedraId ?? "",
    fechaDesde: initial?.fechaDesde ?? "",
    fechaHasta: initial?.fechaHasta ?? "",
  };
}
