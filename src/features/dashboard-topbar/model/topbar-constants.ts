import type { TSearchGroup } from "./topbar.types";

export const ACTIVITY_ICON: Record<string, string> = {
  solicitud: "ph:tray",
  pago: "ph:credit-card",
  cuota: "ph:receipt",
  inscripcion: "ph:user-plus",
  asistencia: "ph:calendar-check",
  sesion: "ph:calendar-blank",
  evaluacion: "ph:exam",
  certificado: "ph:certificate",
};

export function activityIcon(tipo: string) {
  for (const [prefix, icon] of Object.entries(ACTIVITY_ICON)) {
    if (tipo.startsWith(prefix)) return icon;
  }
  return "ph:bell-ringing";
}

export type TNotificationTone = "violet" | "destructive" | "primary" | "secondary";

export const SECTION_TONE: Record<TNotificationTone, string> = {
  violet: "text-violet-600 dark:text-violet-400",
  destructive: "text-destructive",
  primary: "text-primary-700 dark:text-primary-300",
  secondary: "text-secondary-800 dark:text-secondary-300",
};

export const QUICK_ACTIONS = [
  { label: "Nueva cátedra", icon: "ph:chalkboard", href: "/dashboard/admin/catedras" },
  { label: "Nuevo curso", icon: "ph:books", href: "/dashboard/admin/cursos" },
  { label: "Registrar pago", icon: "ph:credit-card", href: "/dashboard/admin/pagos" },
  { label: "Nueva solicitud", icon: "ph:tray", href: "/dashboard/admin/solicitudes" },
];

export const GROUP_META: Record<TSearchGroup, { label: string; icon: string }> = {
  estudiantes: { label: "Estudiantes", icon: "ph:student" },
  docentes: { label: "Docentes", icon: "ph:chalkboard-teacher" },
  cursos: { label: "Cursos", icon: "ph:books" },
};
