import { z } from "zod";

import type { ISelectFieldOption } from "@/shared/form";
import { formatMonthPeriod } from "@/shared/lib/formatters";

export const generarCuotasFormSchema = z.object({
  mes: z.string().min(1, "Selecciona un mes"),
});

export type IGenerarCuotasFormValues = z.infer<typeof generarCuotasFormSchema>;

export function getGenerarCuotasFormDefaults(): IGenerarCuotasFormValues {
  return { mes: "" };
}

export function getMonthOptions(): ISelectFieldOption[] {
  const options: ISelectFieldOption[] = [];
  const now = new Date();

  for (let index = 0; index < 6; index++) {
    const date = new Date(now.getFullYear(), now.getMonth() + index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label: formatMonthPeriod(value) });
  }

  return options;
}