import { z } from "zod";

import type { TablesInsert, TablesUpdate } from "@/shared/api/supabase/database.types";

import type { ISeccionRow } from "./seccion.types";

export const seccionFormSchema = z
  .object({
    clave: z.string().trim().min(2, "Ingresa una clave única").regex(/^[a-z0-9_]+$/, "Solo minúsculas, números y guion bajo"),
    titulo: z.string().trim().min(2, "Ingresa el título"),
    contenido: z.string().trim().min(10, "El contenido debe tener al menos 10 caracteres"),
    publicId: z.string(),
    file: z.instanceof(File).nullable().optional(),
    removeImage: z.boolean(),
    alt: z.string().trim().optional(),
    orden: z.number().int().min(0, "El orden no puede ser negativo"),
    publicado: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const hasImage = Boolean(values.file || (values.publicId && !values.removeImage));
    if (hasImage && !values.alt) {
      ctx.addIssue({ code: "custom", path: ["alt"], message: "Describe la imagen" });
    }
  });

export type ISeccionFormValues = z.infer<typeof seccionFormSchema>;

export function getSeccionFormDefaults(item?: ISeccionRow): ISeccionFormValues {
  return {
    clave: item?.clave ?? "",
    titulo: item?.titulo ?? "",
    contenido: item?.contenido ?? "",
    publicId: item?.imagenPublicId ?? "",
    file: null,
    removeImage: false,
    alt: item?.imagenTextoAlt ?? "",
    orden: item?.orden ?? 0,
    publicado: item?.publicado ?? false,
  };
}

export function buildSeccionPayload(
  values: ISeccionFormValues,
  publicId: string | null
): TablesInsert<"secciones_institucionales"> {
  return {
    clave: values.clave.trim().toLowerCase(),
    titulo: values.titulo.trim(),
    contenido: values.contenido.trim(),
    imagen_public_id: publicId,
    imagen_texto_alt: publicId ? values.alt?.trim() || null : null,
    orden: values.orden,
    publicado: values.publicado,
  };
}

export function buildSeccionUpdatePayload(
  values: ISeccionFormValues,
  publicId: string | null
): TablesUpdate<"secciones_institucionales"> {
  return buildSeccionPayload(values, publicId);
}
