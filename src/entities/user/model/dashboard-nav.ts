import type { TRol } from "./user.types"
import type { IDashboardNavGroup, IDashboardNavItem } from "./dashboard-nav.types"

const ADMIN_NAV: IDashboardNavGroup[] = [
  {
    label: "Panel general",
    icon: "ph:squares-four",
    href: "/dashboard/admin",
  },
  {
    label: "Admisiones y matrículas",
    icon: "ph:tray",
    items: [
      { label: "Solicitudes", href: "/dashboard/admin/solicitudes", icon: "ph:tray" },
      { label: "Matrículas", href: "/dashboard/admin/matriculas", icon: "ph:user-plus" },
    ],
  },
  {
    label: "Cobranza y pagos",
    icon: "ph:credit-card",
    items: [
      { label: "Cuotas", href: "/dashboard/admin/cuotas", icon: "ph:receipt" },
      { label: "Pagos", href: "/dashboard/admin/pagos", icon: "ph:credit-card" },
      { label: "Acuerdos de pago", href: "/dashboard/admin/acuerdos", icon: "ph:handshake" },
      { label: "Cobranza por familia", href: "/dashboard/admin/cobranza", icon: "ph:coins" },
    ],
  },
  {
    label: "Personas",
    icon: "ph:users-three",
    items: [
      { label: "Estudiantes", href: "/dashboard/admin/estudiantes", icon: "ph:student" },
      { label: "Docentes", href: "/dashboard/admin/docentes", icon: "ph:chalkboard-teacher" },
      { label: "Representantes", href: "/dashboard/admin/representantes", icon: "ph:identification-badge" },
      { label: "Usuarios y roles", href: "/dashboard/admin/usuarios", icon: "ph:users-three" },
    ],
  },
  {
    label: "Academia",
    icon: "ph:graduation-cap",
    items: [
      { label: "Programas", href: "/dashboard/admin/programas", icon: "ph:graduation-cap" },
      { label: "Cursos", href: "/dashboard/admin/cursos", icon: "ph:books" },
      { label: "Cátedras", href: "/dashboard/admin/catedras", icon: "ph:chalkboard" },
      { label: "Horarios y sesiones", href: "/dashboard/admin/horarios", icon: "ph:calendar-check" },
      { label: "Evaluaciones", href: "/dashboard/admin/evaluaciones", icon: "ph:exam" },
      { label: "Materiales", href: "/dashboard/admin/materiales", icon: "ph:file-audio" },
      { label: "Instrumentos", href: "/dashboard/admin/instrumentos", icon: "ph:guitar" },
      { label: "Certificados", href: "/dashboard/admin/certificados", icon: "ph:certificate" },
    ],
  },
  {
    label: "Sitio público",
    icon: "ph:globe",
    items: [
      { label: "Testimonios", href: "/dashboard/admin/testimonios", icon: "ph:chat-centered-text" },
      { label: "Reseñas", href: "/dashboard/admin/resenas", icon: "ph:chat-centered-dots" },
      { label: "Galería", href: "/dashboard/admin/galeria", icon: "ph:image" },
      { label: "Secciones", href: "/dashboard/admin/secciones", icon: "ph:layout" },
      { label: "Métricas", href: "/dashboard/admin/metricas", icon: "ph:chart-line-up" },
    ],
  },
]

const CUENTA_NAV_ITEM: IDashboardNavItem = {
  label: "Mi cuenta",
  href: "/dashboard/perfil",
  icon: "ph:user-circle",
}

const ADMIN_NAV_FOOTER: IDashboardNavItem[] = [
  CUENTA_NAV_ITEM,
  { label: "Configuración", href: "/dashboard/admin/configuracion", icon: "ph:gear-six" },
]

const TEACHER_NAV: IDashboardNavGroup[] = [
  {
    label: "Panel general",
    icon: "ph:squares-four",
    href: "/dashboard/teacher",
  },
  {
    label: "Academia",
    icon: "ph:graduation-cap",
    items: [
      { label: "Mis cátedras", href: "/dashboard/teacher/catedras", icon: "ph:chalkboard" },
      { label: "Mis estudiantes", href: "/dashboard/teacher/estudiantes", icon: "ph:student" },
      { label: "Sesiones y asistencia", href: "/dashboard/teacher/sesiones", icon: "ph:calendar-check" },
      { label: "Evaluaciones", href: "/dashboard/teacher/evaluaciones", icon: "ph:exam" },
      { label: "Materiales", href: "/dashboard/teacher/materiales", icon: "ph:file-audio" },
    ],
  },
  {
    label: "Mi perfil",
    icon: "ph:user-circle",
    items: [
      { label: "Perfil profesional", href: "/dashboard/teacher/perfil", icon: "ph:user-circle" },
    ],
  },
]

const STUDENT_NAV: IDashboardNavGroup[] = [
  {
    label: "General",
    icon: "ph:squares-four",
    items: [
      { label: "Inicio", href: "/dashboard/student", icon: "ph:squares-four" },
      { label: "Mis cátedras", href: "/dashboard/student/catedras", icon: "ph:chalkboard" },
      { label: "Notas y asistencia", href: "/dashboard/student/notas", icon: "ph:exam" },
      { label: "Práctica", href: "/dashboard/student/practica", icon: "ph:guitar" },
      { label: "Recursos", href: "/dashboard/student/recursos", icon: "ph:books" },
      { label: "Finanzas", href: "/dashboard/student/finanzas", icon: "ph:coins" },
      { label: "Certificados", href: "/dashboard/student/certificados", icon: "ph:certificate" },
      { label: "Proyección", href: "/dashboard/student/proyeccion", icon: "ph:trend-up" },
    ],
  },
]

export const DASHBOARD_NAV: Record<TRol, IDashboardNavGroup[]> = {
  admin: ADMIN_NAV,
  docente: TEACHER_NAV,
  estudiante: STUDENT_NAV,
  representante: STUDENT_NAV,
}

export const DASHBOARD_NAV_FOOTER: Record<TRol, IDashboardNavItem[]> = {
  admin: ADMIN_NAV_FOOTER,
  docente: [CUENTA_NAV_ITEM],
  estudiante: [CUENTA_NAV_ITEM],
  representante: [CUENTA_NAV_ITEM],
}

function iterateItems(groups: IDashboardNavGroup[]): IDashboardNavItem[] {
  return groups.flatMap((group) => {
    const items = group.items ?? []
    if (group.href) {
      return [{ label: group.label, href: group.href, icon: group.icon ?? "ph:dot" }, ...items]
    }
    return items
  })
}

export function getDashboardSectionLabel(
  pathname: string,
  groups: IDashboardNavGroup[],
  footerItems: IDashboardNavItem[] = [],
): string {
  let bestLabel = ""
  let bestLength = -1

  for (const item of [...iterateItems(groups), ...footerItems]) {
    const matches = item.href === pathname || pathname.startsWith(`${item.href}/`)
    if (matches && item.href.length > bestLength) {
      bestLabel = item.label
      bestLength = item.href.length
    }
  }

  return bestLabel
}

export function getDashboardSectionGroup(pathname: string, groups: IDashboardNavGroup[]): string {
  let bestGroup = ""
  let bestLength = -1

  for (const group of groups) {
    const candidates = group.href
      ? [{ href: group.href }, ...(group.items ?? [])]
      : group.items ?? []
    for (const item of candidates) {
      const matches = item.href === pathname || pathname.startsWith(`${item.href}/`)
      if (matches && item.href.length > bestLength) {
        bestGroup = group.label
        bestLength = item.href.length
      }
    }
  }

  return bestGroup
}
