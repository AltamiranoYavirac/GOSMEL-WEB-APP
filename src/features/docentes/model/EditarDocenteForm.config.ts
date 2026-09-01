import { z } from "zod";

export const editarDocenteFormSchema = z.object({
  titulo: z.string().optional(),
  aniosExperiencia: z.coerce.number().int().min(0, "Ingresa un valor válido"),
  biografia: z.string().optional(),
  publicado: z.boolean(),
  destacado: z.boolean(),
});

export type IEditarDocenteFormValues = z.infer<typeof editarDocenteFormSchema>;

export function getEditarDocenteFormDefaults(initial?: Partial<IEditarDocenteFormValues>): IEditarDocenteFormValues {
  return {
    titulo: initial?.titulo ?? "",
    aniosExperiencia: initial?.aniosExperiencia ?? 0,
    biografia: initial?.biografia ?? "",
    publicado: initial?.publicado ?? false,
    destacado: initial?.destacado ?? false,
  };
}