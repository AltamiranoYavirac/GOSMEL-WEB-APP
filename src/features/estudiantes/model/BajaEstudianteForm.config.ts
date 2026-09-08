import { z } from "zod";

export const bajaEstudianteFormSchema = z.object({
  motivo: z.string().trim().optional(),
  condonarCuotasPendientes: z.boolean(),
});

export type IBajaEstudianteFormValues = z.infer<typeof bajaEstudianteFormSchema>;

export function getBajaEstudianteFormDefaults(): IBajaEstudianteFormValues {
  return {
    motivo: "",
    condonarCuotasPendientes: false,
  };
}
