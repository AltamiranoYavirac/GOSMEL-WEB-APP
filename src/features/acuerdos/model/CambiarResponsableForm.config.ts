import { z } from "zod";
export const SIN_RESPONSABLE_VALUE = "sin-responsable";
export const cambiarResponsableFormSchema = z.object({
  representanteId: z.string(),
  motivo: z.string().trim().min(3, "Indica el motivo del cambio"),
});
export type ICambiarResponsableFormValues = z.infer<typeof cambiarResponsableFormSchema>;
export const getCambiarResponsableFormDefaults = (): ICambiarResponsableFormValues => ({ representanteId: SIN_RESPONSABLE_VALUE, motivo: "" });
