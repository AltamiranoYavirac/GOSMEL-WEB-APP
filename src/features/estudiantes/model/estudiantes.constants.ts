import type { TBadgeVariant } from "@/shared/ui";

import type { TNivelCurso } from "./estudiante.types";

export const NIVEL_BADGE: Record<TNivelCurso, { label: string; variant: TBadgeVariant }> = {
  iniciacion: { label: "Iniciación", variant: "ghost" },
  basico: { label: "Básico", variant: "outline" },
  intermedio: { label: "Intermedio", variant: "secondary" },
  avanzado: { label: "Avanzado", variant: "info" },
  maestria: { label: "Maestría", variant: "default" },
};

export const ESTUDIANTE_ACTIVO_BADGE: Record<"true" | "false", { label: string; variant: TBadgeVariant }> = {
  true: { label: "Activo", variant: "default" },
  false: { label: "Inactivo", variant: "destructive" },
};