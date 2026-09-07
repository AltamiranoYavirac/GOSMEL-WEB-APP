import { z } from "zod";

import type { TTipoPortafolio } from "./teacher-dashboard.types";

export const PORTAFOLIO_TIPO_OPCIONES: { value: TTipoPortafolio; label: string }[] = [
  { value: "video", label: "Video (YouTube, Vimeo)" },
  { value: "audio", label: "Audio (SoundCloud, Spotify)" },
  { value: "imagen", label: "Imagen" },
];

export const teacherPortafolioFormSchema = z.object({
  titulo: z.string().min(2, "El título es obligatorio"),
  tipo: z.enum(["video", "audio", "imagen"]),
  urlExterna: z.string().url("Debe ser una URL válida"),
});

export type ITeacherPortafolioFormValues = z.infer<typeof teacherPortafolioFormSchema>;

export function getTeacherPortafolioFormDefaults(): ITeacherPortafolioFormValues {
  return {
    titulo: "",
    tipo: "video",
    urlExterna: "",
  };
}

export function buildTeacherPortafolioPayload(
  values: ITeacherPortafolioFormValues,
  docenteId: string,
  orden = 0
) {
  return {
    docente_id: docenteId,
    titulo: values.titulo.trim(),
    tipo: values.tipo,
    url_externa: values.urlExterna.trim(),
    orden,
  };
}
