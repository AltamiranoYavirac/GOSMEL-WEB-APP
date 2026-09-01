import { z } from "zod";

export const aprobarMatriculaFormSchema = z.object({
  inscripcionId: z.string().min(1, "Selecciona un estudiante"),
  montoMensual: z.coerce.number().positive("Ingresa un monto válido"),
  diaCobro: z.coerce.number().int().min(1, "Entre 1 y 28").max(28, "Entre 1 y 28"),
  motivoAjuste: z.string().optional(),
});

export type IAprobarMatriculaFormValues = z.infer<typeof aprobarMatriculaFormSchema>;

export function getAprobarMatriculaFormDefaults(): IAprobarMatriculaFormValues {
  return { inscripcionId: "", montoMensual: 0, diaCobro: 1, motivoAjuste: "" };
}