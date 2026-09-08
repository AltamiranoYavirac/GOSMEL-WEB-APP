import { z } from "zod";

export const rechazarMatriculaFormSchema = z.object({
  motivo: z.string().min(4, "El motivo es obligatorio"),
});

export type IRechazarMatriculaFormValues = z.infer<typeof rechazarMatriculaFormSchema>;

export function getRechazarMatriculaFormDefaults(): IRechazarMatriculaFormValues {
  return { motivo: "" };
}
