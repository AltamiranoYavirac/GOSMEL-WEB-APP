import { z } from "zod";

export const cierreAcuerdoFormSchema = z.object({
  motivo: z.string().trim().min(3, "Indica el motivo de cierre"),
});

export type ICierreAcuerdoFormValues = z.infer<typeof cierreAcuerdoFormSchema>;

export function getCierreAcuerdoFormDefaults(): ICierreAcuerdoFormValues {
  return { motivo: "" };
}
