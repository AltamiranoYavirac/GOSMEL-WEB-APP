import type { TBadgeVariant } from "@/shared/ui";

export interface IDocenteRow {
  id: string;
  nombre: string;
  email: string | null;
  titulo: string | null;
  instrumentos: string[];
  aniosExperiencia: number | null;
  destacado: boolean;
  publicado: boolean;
}

export const DOCENTE_DESTACADO_BADGE: Record<"true" | "false", { label: string; variant: TBadgeVariant }> = {
  true: { label: "Destacado", variant: "default" },
  false: { label: "Regular", variant: "ghost" },
};