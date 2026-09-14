import { z } from "zod";

export const motivoCuotaFormSchema = z.object({ motivo: z.string().trim().min(3, "Indica el motivo de la operación") });
export type IMotivoCuotaFormValues = z.infer<typeof motivoCuotaFormSchema>;
export function getMotivoCuotaFormDefaults(): IMotivoCuotaFormValues { return { motivo: "" }; }
