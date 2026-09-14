import { z } from "zod";

import type { ICreateDocenteInput } from "../api/createDocente";

export const crearDocenteFormSchema = z
  .object({
    perfilId: z.string().min(1, "Selecciona un usuario registrado"),
    slug: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
        "Usa minúsculas, números y guiones"
      ),
    tituloProfesional: z.string().trim().optional(),
    instrumentoIds: z.array(z.string()),
    instrumentoPrincipalId: z.string(),
    aniosExperiencia: z.number().int().min(0, "Ingresa un valor válido").nullable(),
    fraseDestacada: z.string().trim().optional(),
    biografia: z.string().trim().optional(),
    publicado: z.boolean(),
    destacado: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (
      values.instrumentoPrincipalId &&
      !values.instrumentoIds.includes(values.instrumentoPrincipalId)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["instrumentoPrincipalId"],
        message: "El instrumento principal debe estar entre los seleccionados",
      });
    }
  });

export type ICrearDocenteFormValues = z.infer<typeof crearDocenteFormSchema>;

export function getCrearDocenteFormDefaults(): ICrearDocenteFormValues {
  return {
    perfilId: "",
    slug: "",
    tituloProfesional: "",
    instrumentoIds: [],
    instrumentoPrincipalId: "",
    aniosExperiencia: null,
    fraseDestacada: "",
    biografia: "",
    publicado: false,
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
    anios_experiencia: values.aniosExperiencia ?? undefined,
    instrumento_ids: values.instrumentoIds,
    instrumento_principal_id: values.instrumentoPrincipalId || undefined,
    publicado: values.publicado,
    destacado: values.destacado,
  };
}
