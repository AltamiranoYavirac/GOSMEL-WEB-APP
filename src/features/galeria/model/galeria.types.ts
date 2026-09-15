import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TCategoriaMedio = Database["public"]["Enums"]["categoria_medio"];

export interface IGaleriaMedioRow {
  id: string;
  titulo: string | null;
  textoAlt: string;
  categoria: TCategoriaMedio;
  publicId: string;
  cursoId: string | null;
  curso: string | null;
  orden: number;
  publicado: boolean;
}

export const CATEGORIA_MEDIO_BADGE: Record<TCategoriaMedio, { label: string; variant: TBadgeVariant }> = {
  instalaciones: { label: "Instalaciones", variant: "secondary" },
  conciertos: { label: "Conciertos", variant: "default" },
  aulas: { label: "Aulas", variant: "outline" },
  general: { label: "General", variant: "ghost" },
};

export interface IPublicGaleriaItem {
  id: string;
  titulo: string | null;
  alt: string;
  categoria: TCategoriaMedio;
  publicId: string;
}
