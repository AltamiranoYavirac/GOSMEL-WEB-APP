import { z } from "zod";

export const moduloFormSchema = z.object({
  titulo: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  orden: z.number().int().min(0).default(0),
});

export type IModuloFormValues = z.infer<typeof moduloFormSchema>;

export function getModuloFormDefaults(initial?: Partial<IModuloFormValues>): IModuloFormValues {
  return {
    titulo: initial?.titulo ?? "",
    descripcion: initial?.descripcion ?? "",
    orden: initial?.orden ?? 0,
  };
}
