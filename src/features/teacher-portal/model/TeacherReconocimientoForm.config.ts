import { z } from "zod";

export const teacherReconocimientoFormSchema = z.object({
  titulo: z.string().min(2, "El título o premio es obligatorio"),
  anio: z.number().min(1950, "Año inválido").max(2030, "Año inválido").optional().nullable(),
  entidadOtorgante: z.string().max(150, "Máximo 150 caracteres").optional().or(z.literal("")),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
});

export type ITeacherReconocimientoFormValues = z.infer<typeof teacherReconocimientoFormSchema>;

export function getTeacherReconocimientoFormDefaults(): ITeacherReconocimientoFormValues {
  return {
    titulo: "",
    anio: new Date().getFullYear(),
    entidadOtorgante: "",
    descripcion: "",
  };
}

export function buildTeacherReconocimientoPayload(
  values: ITeacherReconocimientoFormValues,
  docenteId: string,
  orden = 0
) {
  return {
    docente_id: docenteId,
    titulo: values.titulo.trim(),
    anio: values.anio ?? null,
    entidad_otorgante: values.entidadOtorgante?.trim() || null,
    descripcion: values.descripcion?.trim() || null,
    orden,
  };
}
