import { z } from "zod";

import type { ICreateDocenteInput } from "../api/createDocente";

export const crearDocenteFormSchema = z.object({
  perfilId: z.string().min(1, "Selecciona un usuario registrado"),
  slug: z.string().trim().optional(),
  tituloProfesional: z.string().trim().optional(),
  instrumentoId: z.string().optional(),
  aniosExperiencia: z.coerce.number().int().min(0, "Ingresa un valor válido"),
  fraseDestacada: z.string().trim().optional(),
  biografia: z.string().trim().optional(),
  publicado: z.boolean(),
  destacado: z.boolean(),
});

export type ICrearDocenteFormValues = z.infer<typeof crearDocenteFormSchema>;

export function getCrearDocenteFormDefaults(): ICrearDocenteFormValues {
  return {
    perfilId: "",
    slug: "",
    tituloProfesional: "",
    instrumentoId: "",
    aniosExperiencia: 3,
    fraseDestacada: "",
    biografia: "",
    publicado: true,
    destacado: false,
  };
}

export function slugifyNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildCrearDocentePayload(
  values: ICrearDocenteFormValues,
  perfilNombre: string
): ICreateDocenteInput {
  return {
    perfil_id: values.perfilId,
    slug: values.slug?.trim() || slugifyNombre(perfilNombre) || `docente-${values.perfilId.slice(0, 6)}`,
    titulo_profesional: values.tituloProfesional || undefined,
    biografia: values.biografia || undefined,
    frase_destacada: values.fraseDestacada || undefined,
    anios_experiencia: values.aniosExperiencia,
    instrumento_id: values.instrumentoId || undefined,
    publicado: values.publicado,
    destacado: values.destacado,
  };
}
