import { z } from "zod";

import type { TNivelCurso } from "./programa.types";

export const programaFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  objetivos: z.string().optional(),
  nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]).optional(),
  instrumentoId: z.string().optional(),
  publicado: z.boolean().default(false),
  orden: z.number().int().min(0).default(0),
});

export type IProgramaFormValues = z.infer<typeof programaFormSchema>;

export function getProgramaFormDefaults(initial?: Partial<IProgramaFormValues>): IProgramaFormValues {
  return {
    nombre: initial?.nombre ?? "",
    descripcion: initial?.descripcion ?? "",
    objetivos: initial?.objetivos ?? "",
    nivel: (initial?.nivel as TNivelCurso) ?? undefined,
    instrumentoId: initial?.instrumentoId ?? undefined,
    publicado: initial?.publicado ?? false,
    orden: initial?.orden ?? 0,
  };
}
