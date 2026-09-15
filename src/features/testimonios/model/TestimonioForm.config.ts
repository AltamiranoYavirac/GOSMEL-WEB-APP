import { z } from "zod";

import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { ITestimonioRow } from "./testimonio.types";

export const testimonioFormSchema = z.object({
  autor: z.string().trim().min(2, "Ingresa el nombre del autor"),
  rol: z.string().trim().optional(),
  cita: z.string().trim().min(10, "La cita debe tener al menos 10 caracteres"),
  puntuacion: z.number().int().min(1).max(5).nullable().optional(),
  publicId: z.string(),
  file: z.instanceof(File).nullable().optional(),
  removeImage: z.boolean(),
  cursoId: z.string().optional(),
  docenteId: z.string().optional(),
  orden: z.number().int().min(0, "El orden no puede ser negativo"),
  publicado: z.boolean(),
});

export type ITestimonioFormValues = z.infer<typeof testimonioFormSchema>;

export function getTestimonioFormDefaults(item?: ITestimonioRow): ITestimonioFormValues {
  return {
    autor: item?.autor ?? "",
    rol: item?.rol ?? "",
    cita: item?.cita ?? "",
    puntuacion: item?.puntuacion ?? null,
    publicId: item?.fotoPublicId ?? "",
    file: null,
    removeImage: false,
    cursoId: item?.cursoId ?? "",
    docenteId: item?.docenteId ?? "",
    orden: item?.orden ?? 0,
    publicado: item?.publicado ?? false,
  };
}

export function buildTestimonioPayload(
  values: ITestimonioFormValues,
  publicId: string | null
): TablesInsert<"testimonios"> {
  return {
    autor_nombre: values.autor.trim(),
    autor_rol: values.rol?.trim() || null,
    cita: values.cita.trim(),
    puntuacion: values.puntuacion ?? null,
    foto_public_id: publicId,
    curso_id: values.cursoId || null,
    docente_id: values.docenteId || null,
    orden: values.orden,
    publicado: values.publicado,
  };
}
