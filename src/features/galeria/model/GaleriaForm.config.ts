import { z } from "zod";

import type { TablesInsert, TablesUpdate } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

import type { IGaleriaMedioRow } from "./galeria.types";

export const CATEGORIA_GALERIA_OPCIONES: ISelectFieldOption[] = [
  { value: "instalaciones", label: "Instalaciones" },
  { value: "conciertos", label: "Conciertos" },
  { value: "aulas", label: "Aulas" },
  { value: "general", label: "General" },
];

export const galeriaFormSchema = z
  .object({
    titulo: z.string().trim().optional(),
    textoAlt: z.string().trim().min(3, "Describe el contenido de la imagen"),
    categoria: z.enum(["instalaciones", "conciertos", "aulas", "general"]),
    cursoId: z.string().optional(),
    publicId: z.string(),
    archivo: z.instanceof(File).nullable().optional(),
    quitarImagen: z.boolean(),
    orden: z.number().int().min(0, "El orden no puede ser negativo"),
    publicado: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.archivo && (!values.publicId || values.quitarImagen)) {
      ctx.addIssue({ code: "custom", path: ["publicId"], message: "Selecciona una imagen" });
    }
  });

export type IGaleriaFormValues = z.infer<typeof galeriaFormSchema>;

export function getGaleriaFormDefaults(): IGaleriaFormValues {
  return {
    titulo: "",
    textoAlt: "",
    categoria: "general",
    cursoId: "",
    publicId: "",
    archivo: null,
    quitarImagen: false,
    orden: 0,
    publicado: false,
  };
}

export function mapGaleriaToFormValues(item: IGaleriaMedioRow): IGaleriaFormValues {
  return {
    titulo: item.titulo ?? "",
    textoAlt: item.textoAlt,
    categoria: item.categoria,
    cursoId: item.cursoId ?? "",
    publicId: item.publicId,
    archivo: null,
    quitarImagen: false,
    orden: item.orden,
    publicado: item.publicado,
  };
}

export function buildGaleriaInsertPayload(
  values: IGaleriaFormValues,
  publicId: string
): TablesInsert<"galeria_medios"> {
  return {
    titulo: values.titulo?.trim() || null,
    texto_alt: values.textoAlt.trim(),
    categoria: values.categoria,
    curso_id: values.cursoId || null,
    public_id: publicId,
    orden: values.orden,
    publicado: values.publicado,
  };
}

export function buildGaleriaUpdatePayload(
  values: IGaleriaFormValues,
  publicId: string
): TablesUpdate<"galeria_medios"> {
  return buildGaleriaInsertPayload(values, publicId);
}
