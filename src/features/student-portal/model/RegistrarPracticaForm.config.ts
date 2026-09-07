import { z } from "zod";

export const registrarPracticaFormSchema = z.object({
  inscripcionId: z.string().min(1, "Selecciona la cátedra"),
  fecha: z.string().min(1, "Selecciona la fecha"),
  minutos: z.coerce.number().int("Usa minutos enteros").positive("Ingresa minutos positivos").max(600, "Máximo 600 minutos"),
  nota: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type IRegistrarPracticaFormValues = z.infer<typeof registrarPracticaFormSchema>;

export function getRegistrarPracticaFormDefaults(): IRegistrarPracticaFormValues {
  return {
    inscripcionId: "",
    fecha: new Date().toISOString().slice(0, 10),
    minutos: 30,
    nota: "",
  };
}