import { z } from "zod";

export const instrumentoFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  tipoInstrumentoId: z.string().min(1, "Debe seleccionar una familia de instrumento"),
  icono: z.string().optional(),
  orden: z.number().int().min(0).default(0),
  activo: z.boolean().default(true),
});

export type IInstrumentoFormValues = z.infer<typeof instrumentoFormSchema>;

export function getInstrumentoFormDefaults(initial?: Partial<IInstrumentoFormValues>): IInstrumentoFormValues {
  return {
    nombre: initial?.nombre ?? "",
    tipoInstrumentoId: initial?.tipoInstrumentoId ?? "",
    icono: initial?.icono ?? "",
    orden: initial?.orden ?? 0,
    activo: initial?.activo ?? true,
  };
}
