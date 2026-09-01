import { z } from "zod";

export const editarRepresentanteFormSchema = z.object({
  nombres: z.string().min(1, "Ingresa los nombres"),
  apellidos: z.string().min(1, "Ingresa los apellidos"),
  celular: z.string().min(1, "Ingresa el teléfono celular"),
  cedula: z.string().optional(),
  email: z.string().optional(),
  ocupacion: z.string().optional(),
  direccion: z.string().optional(),
});

export type IEditarRepresentanteFormValues = z.infer<typeof editarRepresentanteFormSchema>;

export function getEditarRepresentanteFormDefaults(initial?: Partial<IEditarRepresentanteFormValues>): IEditarRepresentanteFormValues {
  return {
    nombres: initial?.nombres ?? "",
    apellidos: initial?.apellidos ?? "",
    celular: initial?.celular ?? "",
    cedula: initial?.cedula ?? "",
    email: initial?.email ?? "",
    ocupacion: initial?.ocupacion ?? "",
    direccion: initial?.direccion ?? "",
  };
}