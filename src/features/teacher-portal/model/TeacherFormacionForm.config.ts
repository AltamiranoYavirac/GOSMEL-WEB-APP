import { z } from "zod";

export const teacherFormacionFormSchema = z.object({
  institucion: z.string().min(2, "La institución es obligatoria"),
  titulo: z.string().min(2, "El título obtenido es obligatorio"),
  anioInicio: z.number().min(1950, "Año inválido").max(2030, "Año inválido").optional().nullable(),
  anioFin: z.number().min(1950, "Año inválido").max(2030, "Año inválido").optional().nullable(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
});

export type ITeacherFormacionFormValues = z.infer<typeof teacherFormacionFormSchema>;

export function getTeacherFormacionFormDefaults(): ITeacherFormacionFormValues {
  return {
    institucion: "",
    titulo: "",
    anioInicio: new Date().getFullYear() - 4,
    anioFin: new Date().getFullYear(),
    descripcion: "",
  };
}

export function buildTeacherFormacionPayload(values: ITeacherFormacionFormValues, docenteId: string, orden = 0) {
  return {
    docente_id: docenteId,
    institucion: values.institucion.trim(),
    titulo: values.titulo.trim(),
    anio_inicio: values.anioInicio ?? null,
    anio_fin: values.anioFin ?? null,
    descripcion: values.descripcion?.trim() || null,
    orden,
  };
}
