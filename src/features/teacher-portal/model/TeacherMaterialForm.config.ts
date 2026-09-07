import { z } from "zod";

import type { TTipoMaterial, TVisibilidadMaterial } from "./teacher-dashboard.types";

export type { TTipoMaterial, TVisibilidadMaterial };

export const MATERIAL_TIPO_OPCIONES: { value: TTipoMaterial; label: string }[] = [
  { value: "pdf", label: "Documento PDF" },
  { value: "partitura", label: "Partitura" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "enlace", label: "Enlace web" },
];

export const MATERIAL_VISIBILIDAD_OPCIONES: { value: TVisibilidadMaterial; label: string }[] = [
  { value: "inscritos", label: "Solo inscritos en la cátedra" },
  { value: "docentes", label: "Comunidad docente" },
  { value: "registrados", label: "Usuarios registrados" },
  { value: "publico", label: "Público general" },
];

export const teacherMaterialFormSchema = z.object({
  catedraId: z.string().min(1, "Debe seleccionar una cátedra"),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  tipo: z.enum(["pdf", "audio", "video", "partitura", "enlace"]),
  visibilidad: z.enum(["publico", "registrados", "inscritos", "docentes"]),
  urlExterna: z.string().url("URL inválida").optional().or(z.literal("")),
  storagePath: z.string().optional().or(z.literal("")),
});

export type ITeacherMaterialFormValues = z.infer<typeof teacherMaterialFormSchema>;

export function getTeacherMaterialFormDefaults(defaultCatedraId = ""): ITeacherMaterialFormValues {
  return {
    catedraId: defaultCatedraId,
    titulo: "",
    tipo: "pdf",
    visibilidad: "inscritos",
    urlExterna: "",
    storagePath: "",
  };
}

export function buildTeacherMaterialPayload(values: ITeacherMaterialFormValues, userId: string) {
  return {
    catedra_id: values.catedraId,
    titulo: values.titulo.trim(),
    tipo: values.tipo,
    visible_para: values.visibilidad,
    url_externa: values.urlExterna?.trim() || null,
    storage_path: values.storagePath?.trim() || null,
    subido_por: userId,
  };
}
