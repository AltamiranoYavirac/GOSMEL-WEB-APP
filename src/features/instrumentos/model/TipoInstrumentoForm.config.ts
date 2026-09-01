import { z } from "zod";

export const tipoInstrumentoFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  orden: z.number().int().min(0).default(0),
  activo: z.boolean().default(true),
});

export type ITipoInstrumentoFormValues = z.infer<typeof tipoInstrumentoFormSchema>;

export function getTipoInstrumentoFormDefaults(initial?: Partial<ITipoInstrumentoFormValues>): ITipoInstrumentoFormValues {
  return {
    nombre: initial?.nombre ?? "",
    orden: initial?.orden ?? 0,
    activo: initial?.activo ?? true,
  };
}
