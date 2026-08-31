import type { TBadgeVariant } from "@/shared/ui";

import type { TNivelCurso } from "./estudiante.types";

export const NIVEL_BADGE: Record<TNivelCurso, { label: string; variant: TBadgeVariant }> = {
  iniciacion: { label: "Iniciación", variant: "secondary" },
  basico: { label: "Básico", variant: "outline" },
  intermedio: { label: "Intermedio", variant: "default" },
  avanzado: { label: "Avanzado", variant: "default" },
  maestria: { label: "Maestría", variant: "ghost" },
};

export const ESTUDIANTE_ACTIVO_BADGE: Record<"true" | "false", { label: string; variant: TBadgeVariant }> = {
  true: { label: "Activo", variant: "default" },
  false: { label: "Inactivo", variant: "destructive" },
};