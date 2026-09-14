import { z } from "zod";

import type { IUpdateDocentePatch } from "../api/updateDocente";
import type { IDocenteDetalle } from "./docente-detalle.types";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const editarDocenteFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "El slug es obligatorio")
      .regex(SLUG_PATTERN, "Usa minúsculas, números y guiones"),
    titulo: z.string().trim().optional(),
    aniosExperiencia: z.number().int().min(0, "Ingresa un valor válido").nullable(),
    fraseDestacada: z.string().trim().optional(),
    biografia: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    youtube: z.string().trim().optional(),
    facebook: z.string().trim().optional(),
    instrumentoIds: z.array(z.string()),
    instrumentoPrincipalId: z.string(),
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

export type IEditarDocenteFormValues = z.infer<typeof editarDocenteFormSchema>;

export function getEditarDocenteFormDefaults(
  initial?: Partial<IEditarDocenteFormValues>
): IEditarDocenteFormValues {
  return {
    slug: initial?.slug ?? "",
    titulo: initial?.titulo ?? "",
    aniosExperiencia: initial?.aniosExperiencia ?? null,
    fraseDestacada: initial?.fraseDestacada ?? "",
    biografia: initial?.biografia ?? "",
    instagram: initial?.instagram ?? "",
    linkedin: initial?.linkedin ?? "",
    youtube: initial?.youtube ?? "",
    facebook: initial?.facebook ?? "",
    instrumentoIds: initial?.instrumentoIds ?? [],
    instrumentoPrincipalId: initial?.instrumentoPrincipalId ?? "",
    publicado: initial?.publicado ?? false,
    destacado: initial?.destacado ?? false,
  };
}

export function mapDocenteToFormValues(
  detalle: Pick<
    IDocenteDetalle,
    | "slug"
    | "titulo"
    | "aniosExperiencia"
    | "fraseDestacada"
    | "biografia"
    | "redesSociales"
    | "instrumentoIds"
    | "instrumentoPrincipalId"
    | "publicado"
    | "destacado"
  >
): IEditarDocenteFormValues {
  return getEditarDocenteFormDefaults({
    slug: detalle.slug,
    titulo: detalle.titulo ?? "",
    aniosExperiencia: detalle.aniosExperiencia,
    fraseDestacada: detalle.fraseDestacada ?? "",
    biografia: detalle.biografia ?? "",
    instagram: detalle.redesSociales.instagram ?? "",
    linkedin: detalle.redesSociales.linkedin ?? "",
    youtube: detalle.redesSociales.youtube ?? "",
    facebook: detalle.redesSociales.facebook ?? "",
    instrumentoIds: detalle.instrumentoIds,
    instrumentoPrincipalId: detalle.instrumentoPrincipalId ?? "",
    publicado: detalle.publicado,
    destacado: detalle.destacado,
  });
}

export function buildDocentePatch(values: IEditarDocenteFormValues): IUpdateDocentePatch {
  const redes: Record<string, string> = {};
  if (values.instagram?.trim()) redes.instagram = values.instagram.trim();
  if (values.linkedin?.trim()) redes.linkedin = values.linkedin.trim();
  if (values.youtube?.trim()) redes.youtube = values.youtube.trim();
  if (values.facebook?.trim()) redes.facebook = values.facebook.trim();

  return {
    slug: values.slug.trim().toLowerCase(),
    titulo_profesional: values.titulo?.trim() || null,
    biografia: values.biografia?.trim() || null,
    frase_destacada: values.fraseDestacada?.trim() || null,
    anios_experiencia: values.aniosExperiencia,
    redes_sociales: redes,
    publicado: values.publicado,
    destacado: values.destacado,
  };
}

export function buildInstrumentosPayload(values: IEditarDocenteFormValues) {
  return {
    instrumentoIds: values.instrumentoIds,
    instrumentoPrincipalId: values.instrumentoPrincipalId || undefined,
  };
}
