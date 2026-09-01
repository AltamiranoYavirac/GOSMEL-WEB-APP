import type { TBadgeVariant } from "@/shared/ui";

export type { TEstadoCatedra, TModalidadCurso, ICatedraRow } from "@/entities/catedra";
import type { TEstadoCatedra, TModalidadCurso } from "@/entities/catedra";

export const CATEDRA_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};