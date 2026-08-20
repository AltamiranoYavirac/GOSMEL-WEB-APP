import type { TRol } from "./user.types"
import type { IDashboardNavGroup } from "./dashboard-nav.types"

const ADMIN_NAV: IDashboardNavGroup[] = [
  {
    label: "General",
    items: [
      { label: "Resumen", href: "/dashboard/admin", icon: "ph:squares-four" },
      { label: "Solicitudes", href: "/dashboard/admin/solicitudes", icon: "ph:tray" },
    ],
  },
  {
    label: "Comunidad",
    items: [
      { label: "Estudiantes", href: "/dashboard/admin/estudiantes", icon: "ph:student" },
      { label: "Docentes", href: "/dashboard/admin/docentes", icon: "ph:chalkboard-teacher" },
      { label: "Representantes", href: "/dashboard/admin/representantes", icon: "ph:identification-badge" },
      { label: "Usuarios y roles", href: "/dashboard/admin/usuarios", icon: "ph:users-three" },
    ],
  },
  {
    label: "Académico",
    items: [
      { label: "Programas", href: "/dashboard/admin/programas", icon: "ph:graduation-cap" },
      { label: "Cursos", href: "/dashboard/admin/cursos", icon: "ph:books" },
      { label: "Cátedras", href: "/dashboard/admin/catedras", icon: "ph:chalkboard" },
      { label: "Horarios y sesiones", href: "/dashboard/admin/horarios", icon: "ph:calendar-check" },
      { label: "Evaluaciones", href: "/dashboard/admin/evaluaciones", icon: "ph:exam" },
      { label: "Materiales", href: "/dashboard/admin/materiales", icon: "ph:file-audio" },
    ],
  },
  {
    label: "Finanzas",
    items: [
      { label: "Acuerdos de pago", href: "/dashboard/admin/acuerdos", icon: "ph:handshake" },
      { label: "Cuotas", href: "/dashboard/admin/cuotas", icon: "ph:receipt" },
      { label: "Pagos", href: "/dashboard/admin/pagos", icon: "ph:credit-card" },
    ],
  },
  {
    label: "Sitio",
    items: [
      { label: "Testimonios", href: "/dashboard/admin/testimonios", icon: "ph:chat-centered-text" },
      { label: "Galería", href: "/dashboard/admin/galeria", icon: "ph:image" },
      { label: "Secciones", href: "/dashboard/admin/secciones", icon: "ph:layout" },
      { label: "Métricas", href: "/dashboard/admin/metricas", icon: "ph:chart-line-up" },
      { label: "Configuración", href: "/dashboard/admin/configuracion", icon: "ph:gear-six" },
    ],
  },
]

const TEACHER_NAV: IDashboardNavGroup[] = [
  {
    label: "General",
    items: [{ label: "Resumen", href: "/dashboard/teacher", icon: "ph:squares-four" }],
  },
]

const STUDENT_NAV: IDashboardNavGroup[] = [
  {
    label: "General",
    items: [{ label: "Resumen", href: "/dashboard/student", icon: "ph:squares-four" }],
  },
]

export const DASHBOARD_NAV: Record<TRol, IDashboardNavGroup[]> = {
  admin: ADMIN_NAV,
  docente: TEACHER_NAV,
  estudiante: STUDENT_NAV,
  representante: STUDENT_NAV,
}

export function getDashboardSectionLabel(pathname: string, groups: IDashboardNavGroup[]): string {
  let bestLabel = ""
  let bestLength = -1

  for (const group of groups) {
    for (const item of group.items) {
      const matches = item.href === pathname || pathname.startsWith(`${item.href}/`)
      if (matches && item.href.length > bestLength) {
        bestLabel = item.label
        bestLength = item.href.length
      }
    }
  }

  return bestLabel
}

export function getDashboardSectionGroup(pathname: string, groups: IDashboardNavGroup[]): string {
  let bestGroup = ""
  let bestLength = -1

  for (const group of groups) {
    for (const item of group.items) {
      const matches = item.href === pathname || pathname.startsWith(`${item.href}/`)
      if (matches && item.href.length > bestLength) {
        bestGroup = group.label
        bestLength = item.href.length
      }
    }
  }

  return bestGroup
}
