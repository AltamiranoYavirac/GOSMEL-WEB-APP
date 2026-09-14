import { z } from "zod";

import type { TablesInsert, TablesUpdate } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

import type { IProgramaDetalle } from "./programa-detalle.types";

export const NIVEL_PROGRAMA_OPCIONES: ISelectFieldOption[] = [
  { value: "iniciacion", label: "Iniciación" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "maestria", label: "Maestría" },
];

export const programaFormSchema = z
  .object({
    nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    descripcion: z.string().trim().optional(),
    nivel: z.enum(["iniciacion", "basico", "intermedio", "avanzado", "maestria"]).optional(),
    imagenPublicId: z.string().default(""),
    imagenArchivo: z.instanceof(File).nullable().optional(),
    quitarImagen: z.boolean().default(false),
    imagenTextoAlt: z.string().trim().optional(),
    precioReferencial: z.number().nonnegative("Precio inválido").nullable().optional(),
    etiquetaPrecio: z.string().trim().optional(),
    mostrarPrecio: z.boolean().default(false),
    publicado: z.boolean().default(false),
    orden: z.number().int().min(0, "El orden no puede ser negativo").default(0),
  })
  .superRefine((values, ctx) => {
    const tieneImagen = Boolean(values.imagenArchivo || (values.imagenPublicId && !values.quitarImagen));
    if (tieneImagen && !values.imagenTextoAlt) {
      ctx.addIssue({ code: "custom", path: ["imagenTextoAlt"], message: "Describe la imagen del programa" });
    }
    if (values.publicado && !tieneImagen) {
      ctx.addIssue({ code: "custom", path: ["imagenPublicId"], message: "Agrega una imagen para publicar" });
    }
    if (values.mostrarPrecio && (values.precioReferencial === null || values.precioReferencial === undefined)) {
      ctx.addIssue({ code: "custom", path: ["precioReferencial"], message: "Ingresa el precio para mostrarlo" });
    }
    if (values.mostrarPrecio && !values.etiquetaPrecio) {
      ctx.addIssue({ code: "custom", path: ["etiquetaPrecio"], message: "Ingresa la etiqueta de precio para mostrarla" });
    }
  });

export type IProgramaFormValues = z.infer<typeof programaFormSchema>;

export function getProgramaFormDefaults(initial?: Partial<IProgramaFormValues>): IProgramaFormValues {
  return {
    nombre: initial?.nombre ?? "",
    descripcion: initial?.descripcion ?? "",
    nivel: initial?.nivel,
    imagenPublicId: initial?.imagenPublicId ?? "",
    imagenArchivo: initial?.imagenArchivo ?? null,
    quitarImagen: initial?.quitarImagen ?? false,
    imagenTextoAlt: initial?.imagenTextoAlt ?? "",
    precioReferencial: initial?.precioReferencial ?? null,
    etiquetaPrecio: initial?.etiquetaPrecio ?? "",
    mostrarPrecio: initial?.mostrarPrecio ?? false,
    publicado: initial?.publicado ?? false,
    orden: initial?.orden ?? 0,
  };
}

export function mapProgramaToFormValues(programa: IProgramaDetalle): IProgramaFormValues {
  return getProgramaFormDefaults({
    nombre: programa.nombre,
    descripcion: programa.descripcion ?? "",
    nivel: programa.nivel ?? undefined,
    imagenPublicId: programa.imagenPublicId ?? "",
    imagenTextoAlt: programa.imagenTextoAlt ?? "",
    precioReferencial: programa.precioReferencial ? Number(programa.precioReferencial) : null,
    etiquetaPrecio: programa.etiquetaPrecio ?? "",
    mostrarPrecio: programa.mostrarPrecio,
    publicado: programa.publicado,
    orden: programa.orden,
  });
}

export function buildProgramaInsertPayload(
  values: IProgramaFormValues,
  slug: string,
  imagenPublicId: string | null
): TablesInsert<"programas"> {
  return {
    nombre: values.nombre.trim(),
    slug,
    descripcion: values.descripcion?.trim() || null,
    nivel: values.nivel || null,
    imagen_public_id: imagenPublicId,
    imagen_texto_alt: imagenPublicId ? values.imagenTextoAlt?.trim() || null : null,
    precio_referencial: values.precioReferencial ?? null,
    etiqueta_precio: values.etiquetaPrecio?.trim() || null,
    mostrar_precio: values.mostrarPrecio,
    publicado: values.publicado,
    orden: values.orden,
  };
}

export function buildProgramaUpdatePayload(
  values: IProgramaFormValues,
  imagenPublicId: string | null
): TablesUpdate<"programas"> {
  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion?.trim() || null,
    nivel: values.nivel || null,
    imagen_public_id: imagenPublicId,
    imagen_texto_alt: imagenPublicId ? values.imagenTextoAlt?.trim() || null : null,
    precio_referencial: values.precioReferencial ?? null,
    etiqueta_precio: values.etiquetaPrecio?.trim() || null,
    mostrar_precio: values.mostrarPrecio,
    publicado: values.publicado,
    orden: values.orden,
  };
}
