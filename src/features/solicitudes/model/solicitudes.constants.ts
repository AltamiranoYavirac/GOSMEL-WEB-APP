import type { TBadgeVariant } from "@/shared/ui";

import type { TSolicitudEstado, TSolicitudTipo } from "./solicitud.types";

export const SOLICITUD_TIPO_BADGE: Record<TSolicitudTipo, { label: string; variant: TBadgeVariant }> = {
  clase_prueba: { label: "Clase de prueba", variant: "outline" },
  admision: { label: "Admisión", variant: "default" },
  masterclass: { label: "Masterclass", variant: "secondary" },
  contacto_general: { label: "Contacto general", variant: "ghost" },
};

export const SOLICITUD_ESTADO_BADGE: Record<
  TSolicitudEstado,
  { label: string; variant: TBadgeVariant }
> = {
  nueva: { label: "Nueva", variant: "info" },
  contactada: { label: "Contactada", variant: "warning" },
  convertida: { label: "Convertida", variant: "success" },
  descartada: { label: "Descartada", variant: "ghost" },
};

export const SOLICITUD_ESTADO_SIGUIENTE: Partial<Record<TSolicitudEstado, TSolicitudEstado>> = {
  nueva: "contactada",
  contactada: "convertida",
};