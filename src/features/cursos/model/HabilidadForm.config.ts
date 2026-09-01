import { z } from "zod";

export const habilidadFormSchema = z.object({
  habilidad: z.string().min(2, "La habilidad debe tener al menos 2 caracteres"),
  orden: z.number().int().min(0).default(0),
});

export type IHabilidadFormValues = z.infer<typeof habilidadFormSchema>;

export function getHabilidadFormDefaults(): IHabilidadFormValues {
  return {
    habilidad: "",
    orden: 0,
  };
}
