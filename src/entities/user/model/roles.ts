import type { TRol } from "./user.types"

export const ROLE_HOME_ROUTE: Record<TRol, string> = {
  admin: "/dashboard/admin",
  docente: "/dashboard/teacher",
  estudiante: "/dashboard/student",
  representante: "/dashboard/student",
}

const ROLE_PRIORITY: TRol[] = ["admin", "docente", "estudiante", "representante"]

export function resolveHomeRoute(roles: TRol[]): string {
  const rolPrioritario = ROLE_PRIORITY.find((rol) => roles.includes(rol))
  return rolPrioritario ? ROLE_HOME_ROUTE[rolPrioritario] : "/dashboard/student"
}
