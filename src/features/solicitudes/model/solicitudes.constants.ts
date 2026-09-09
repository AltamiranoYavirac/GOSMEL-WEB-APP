import type { TBadgeVariant } from "@/shared/ui";

import type { TSolicitudEstado, TSolicitudTipo } from "./solicitud.types";

export const SOLICITUD_TIPO_BADGE: Record<
  TSolicitudTipo,
  {
    label: string;
    variant: TBadgeVariant;
    icon: string;
    tone: "info" | "success" | "warning" | "neutral";
  }
> = {
  clase_prueba: {
    label: "Clase de prueba",
    variant: "info",
    icon: "ph:chalkboard-teacher",
    tone: "info",
  },
  admision: {
    label: "Admisión",
    variant: "success",
    icon: "ph:student",
    tone: "success",
  },
  masterclass: {
    label: "Masterclass",
    variant: "warning",
    icon: "ph:presentation-chart",
    tone: "warning",
  },
  contacto_general: {
    label: "Contacto general",
    variant: "ghost",
    icon: "ph:chat-circle-dots",
    tone: "neutral",
  },
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