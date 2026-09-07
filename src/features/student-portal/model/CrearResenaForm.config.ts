import { z } from "zod";

export const crearResenaFormSchema = z.object({
  cursoId: z.string().min(1, "Selecciona un curso"),
  puntuacion: z.coerce.number().int("Usa estrellas enteras").min(1, "Da al menos 1 estrella").max(5, "Máximo 5 estrellas"),
  comentario: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

export type ICrearResenaFormValues = z.infer<typeof crearResenaFormSchema>;

export function getCrearResenaFormDefaults(): ICrearResenaFormValues {
  return {
    cursoId: "",
    puntuacion: 5,
    comentario: "",
  };
}

export const PUNTUACION_OPCIONES = [1, 2, 3, 4, 5].map((value) => ({
  value: String(value),
  label: `${value} estrella${value > 1 ? "s" : ""}`,
}));