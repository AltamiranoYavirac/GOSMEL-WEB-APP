import type { TRol } from "./user.types"

export const ROLE_HOME_ROUTE: Record<TRol, string> = {
  admin: "/dashboard/admin",
  docente: "/dashboard/teacher",
  estudiante: "/dashboard/student",
  representante: "/dashboard/student",
}

export const ROLE_LABEL: Record<TRol, string> = {
  admin: "Administración",
  docente: "Docente",
  estudiante: "Estudiante",
  representante: "Representante",
}

export const ROLE_PROFILE_ROUTE: Partial<Record<TRol, string>> = {
  admin: "/dashboard/admin/configuracion",
  docente: "/dashboard/teacher/perfil",
}

const ROLE_PRIORITY: TRol[] = ["admin", "docente", "estudiante", "representante"]

export function resolveHomeRoute(roles: TRol[]): string {
  const rolPrioritario = ROLE_PRIORITY.find((rol) => roles.includes(rol))
  return rolPrioritario ? ROLE_HOME_ROUTE[rolPrioritario] : "/dashboard/student"
}

export function resolvePrimaryRole(roles: TRol[]): TRol {
  return ROLE_PRIORITY.find((rol) => roles.includes(rol)) ?? "estudiante"
}

export function resolveProfileRoute(roles: TRol[]): string | null {
  const rol = ROLE_PRIORITY.find((r) => roles.includes(r) && ROLE_PROFILE_ROUTE[r])
  return rol ? (ROLE_PROFILE_ROUTE[rol] ?? null) : null
}
