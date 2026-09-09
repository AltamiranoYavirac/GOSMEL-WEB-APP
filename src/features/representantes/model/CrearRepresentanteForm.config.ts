import { z } from "zod";

import type { ICreateRepresentanteInput } from "./representante.types";

export const crearRepresentanteFormSchema = z.object({
  nombres: z.string().trim().min(1, "Ingresa los nombres"),
  apellidos: z.string().trim().min(1, "Ingresa los apellidos"),
  celular: z.string().trim().min(1, "Ingresa el teléfono celular"),
  cedula: z.string().trim().optional(),
  email: z.union([z.string().trim().email("Ingresa un correo válido"), z.literal("")]).optional(),
  ocupacion: z.string().trim().optional(),
  direccion: z.string().trim().optional(),
});

export type ICrearRepresentanteFormValues = z.infer<typeof crearRepresentanteFormSchema>;

export function getCrearRepresentanteFormDefaults(): ICrearRepresentanteFormValues {
  return {
    nombres: "",
    apellidos: "",
    celular: "",
    cedula: "",
    email: "",
    ocupacion: "",
    direccion: "",
  };
}

export function buildCrearRepresentantePayload(
  values: ICrearRepresentanteFormValues
): ICreateRepresentanteInput {
  return {
    nombres: values.nombres,
    apellidos: values.apellidos,
    celular: values.celular,
    email: values.email?.trim() || undefined,
    cedula: values.cedula?.trim() || undefined,
    direccion: values.direccion?.trim() || undefined,
    ocupacion: values.ocupacion?.trim() || undefined,
  };
}
