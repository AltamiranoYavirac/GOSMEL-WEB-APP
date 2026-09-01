import { z } from "zod";

export const leccionFormSchema = z.object({
  titulo: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  duracionMinutos: z.number().int().min(1).optional(),
  esMuestra: z.boolean().default(false),
  orden: z.number().int().min(0).default(0),
});

export type ILeccionFormValues = z.infer<typeof leccionFormSchema>;

export function getLeccionFormDefaults(initial?: Partial<ILeccionFormValues>): ILeccionFormValues {
  return {
    titulo: initial?.titulo ?? "",
    descripcion: initial?.descripcion ?? "",
    duracionMinutos: initial?.duracionMinutos,
    esMuestra: initial?.esMuestra ?? false,
    orden: initial?.orden ?? 0,
  };
}
