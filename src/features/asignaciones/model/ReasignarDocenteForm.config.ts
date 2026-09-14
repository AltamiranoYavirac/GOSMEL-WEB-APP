import { z } from "zod";

export const reasignarDocenteFormSchema = z.object({
  docenteId: z.string().min(1, "Selecciona un docente"),
});

export type IReasignarDocenteFormValues = z.infer<typeof reasignarDocenteFormSchema>;

export function getReasignarDocenteFormDefaults(
  docenteId = ""
): IReasignarDocenteFormValues {
  return { docenteId };
}
