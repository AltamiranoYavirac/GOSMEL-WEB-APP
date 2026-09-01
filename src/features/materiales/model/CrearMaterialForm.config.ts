import { z } from "zod";

import type { Database } from "@/shared/api/supabase/database.types";
import type { ISelectFieldOption } from "@/shared/form";

export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];
export type TVisibilidadMaterial = Database["public"]["Enums"]["visibilidad_material"];

export const crearMaterialFormSchema = z
  .object({
    titulo: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
    tipo: z.enum(["pdf", "audio", "video", "partitura", "enlace"]),
    visibilidad: z.enum(["publico", "registrados", "inscritos", "docentes"]),
    destino: z.string().optional(),
    cursoId: z.string().optional(),
    catedraId: z.string().optional(),
    urlExterna: z.string().trim().optional().or(z.literal("")),
    storagePath: z.string().optional(),
    archivoNombre: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.destino === "curso" && !values.cursoId) {
      ctx.addIssue({ code: "custom", path: ["cursoId"], message: "Selecciona un curso" });
    }
    if (values.destino === "catedra" && !values.catedraId) {
      ctx.addIssue({ code: "custom", path: ["catedraId"], message: "Selecciona una cátedra" });
    }
  });

export type ICrearMaterialFormValues = z.infer<typeof crearMaterialFormSchema>;

export function getCrearMaterialFormDefaults(): ICrearMaterialFormValues {
  return {
    titulo: "",
    tipo: "pdf",
    visibilidad: "docentes",
    destino: "",
    cursoId: "",
    catedraId: "",
    urlExterna: "",
    storagePath: "",
    archivoNombre: "",
  };
}

export interface ICursoMaterialOption {
  id: string;
  nombre: string;
}

export interface ICatedraMaterialOption {
  id: string;
  label: string;
}

export const TIPO_MATERIAL_OPCIONES: ISelectFieldOption[] = [
  { value: "pdf", label: "PDF" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "partitura", label: "Partitura" },
  { value: "enlace", label: "Enlace" },
];

export const VISIBILIDAD_MATERIAL_OPCIONES: ISelectFieldOption[] = [
  { value: "publico", label: "Público" },
  { value: "registrados", label: "Registrados" },
  { value: "inscritos", label: "Inscritos" },
  { value: "docentes", label: "Docentes" },
];

export const DESTINO_OPCIONES: ISelectFieldOption[] = [
  { value: "curso", label: "Curso" },
  { value: "catedra", label: "Cátedra" },
];