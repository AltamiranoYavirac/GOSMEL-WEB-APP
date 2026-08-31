import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];
export type TVisibilidadMaterial = Database["public"]["Enums"]["visibilidad_material"];

export interface IMaterialRow {
  id: string;
  titulo: string;
  tipo: TTipoMaterial;
  visibilidad: TVisibilidadMaterial;
  destino: string | null;
  subidoPor: string | null;
}

export const TIPO_MATERIAL_BADGE: Record<TTipoMaterial, { label: string; variant: TBadgeVariant }> = {
  pdf: { label: "PDF", variant: "outline" },
  audio: { label: "Audio", variant: "secondary" },
  video: { label: "Video", variant: "default" },
  partitura: { label: "Partitura", variant: "default" },
  enlace: { label: "Enlace", variant: "ghost" },
};

export const VISIBILIDAD_MATERIAL_BADGE: Record<TVisibilidadMaterial, { label: string; variant: TBadgeVariant }> = {
  publico: { label: "Público", variant: "default" },
  registrados: { label: "Registrados", variant: "secondary" },
  inscritos: { label: "Inscritos", variant: "outline" },
  docentes: { label: "Docentes", variant: "ghost" },
};