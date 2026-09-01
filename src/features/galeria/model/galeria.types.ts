import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TCategoriaMedio = Database["public"]["Enums"]["categoria_medio"];

export interface IGaleriaMedioRow {
  id: string;
  titulo: string | null;
  textoAlt: string;
  categoria: TCategoriaMedio;
  publicId: string;
  publicado: boolean;
}

export const CATEGORIA_MEDIO_BADGE: Record<TCategoriaMedio, { label: string; variant: TBadgeVariant }> = {
  instalaciones: { label: "Instalaciones", variant: "secondary" },
  conciertos: { label: "Conciertos", variant: "default" },
  aulas: { label: "Aulas", variant: "outline" },
  general: { label: "General", variant: "ghost" },
};

const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/dv9lm0fnm/image/upload";

export function galeriaImageUrl(publicId: string, width: number): string {
  return `${CLOUDINARY_IMAGE_BASE}/q_auto,f_auto,w_${width}/${publicId}`;
}