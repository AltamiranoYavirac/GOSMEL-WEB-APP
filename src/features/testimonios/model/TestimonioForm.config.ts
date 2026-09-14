import { z } from "zod";

import type { TablesInsert } from "@/shared/api/supabase/database.types";

import type { ITestimonioRow } from "./testimonio.types";

export const testimonioFormSchema = z.object({
  autor: z.string().trim().min(2, "Ingresa el nombre del autor"),
  rol: z.string().trim().optional(),
  cita: z.string().trim().min(10, "La cita debe tener al menos 10 caracteres"),
  puntuacion: z.number().int().min(1).max(5).nullable().optional(),
  cursoId: z.string().optional(),
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
    cursoId: item?.cursoId ?? "",
    orden: item?.orden ?? 0,
    publicado: item?.publicado ?? false,
  };
}

export function buildTestimonioPayload(values: ITestimonioFormValues): TablesInsert<"testimonios"> {
  return {
    autor_nombre: values.autor.trim(),
    autor_rol: values.rol?.trim() || null,
    cita: values.cita.trim(),
    puntuacion: values.puntuacion ?? null,
    curso_id: values.cursoId || null,
    orden: values.orden,
    publicado: values.publicado,
  };
}
