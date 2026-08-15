import { AppImages } from "@/shared/config/images";
import type { IDashboardTip, IDashboardEvent, IDashboardRecommended } from "./dashboard.types";

export const DASHBOARD_TIPS: IDashboardTip[] = [
  {
    id: "tip-1",
    icon: "mdi:lungs",
    title: "Técnica de Respiración",
    description: "Practica el apoyo diafragmático para frases largas.",
  },
  {
    id: "tip-2",
    icon: "mdi:timer-outline",
    title: "Práctica Eficiente",
    description: "Fragmenta pasajes difíciles en sesiones de 15 min.",
  },
  {
    id: "tip-3",
    icon: "mdi:meditation",
    title: "Preparación Escénica",
    description: "Visualiza tu ejecución para reducir los nervios.",
  },
];

export const DASHBOARD_EVENTS: IDashboardEvent[] = [
  {
    id: "event-1",
    date: "15 Diciembre",
    title: "Gala de Invierno: Jóvenes Virtuosos",
    location: "Sala Casa de la Cultura",
  },
];

export const DASHBOARD_RECOMMENDED: IDashboardRecommended[] = [
  {
    id: "rec-1",
    title: "Solfeo",
    schedule: "30 Oct - 17:00 CET",
    imageUrl: AppImages.DASHBOARD_RECOMMENDED_1,
    enrollHref: "/coming-soon",
  },
  {
    id: "rec-2",
    title: "Guitarra Clásica",
    schedule: "02 Nov - 18:00 CET",
    imageUrl: AppImages.DASHBOARD_RECOMMENDED_2,
    enrollHref: "/coming-soon",
  },
];