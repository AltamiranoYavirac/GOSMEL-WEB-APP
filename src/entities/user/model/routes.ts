import type { TRol } from "./user.types"
import { resolveHomeRoute } from "./roles"

const DASHBOARD_PREFIX = "/dashboard"

function isDashboardPath(pathname: string): boolean {
  return pathname === DASHBOARD_PREFIX || pathname.startsWith(`${DASHBOARD_PREFIX}/`)
}

export function isDashboardRouteAllowed(pathname: string, roles: TRol[]): boolean {
  if (!isDashboardPath(pathname)) return false

  if (pathname === DASHBOARD_PREFIX || pathname === `${DASHBOARD_PREFIX}/`) {
    return roles.length > 0
  }

  if (pathname === `${DASHBOARD_PREFIX}/admin` || pathname.startsWith(`${DASHBOARD_PREFIX}/admin/`)) {
    return roles.includes("admin")
  }

  if (pathname === `${DASHBOARD_PREFIX}/teacher` || pathname.startsWith(`${DASHBOARD_PREFIX}/teacher/`)) {
    return roles.includes("admin") || roles.includes("docente")
  }

  if (pathname === `${DASHBOARD_PREFIX}/student` || pathname.startsWith(`${DASHBOARD_PREFIX}/student/`)) {
    return !roles.includes("admin") && !roles.includes("docente")
  }

  return false
}

export function resolvePostLoginRoute(next: string | null | undefined, roles: TRol[]): string {
  const fallback = resolveHomeRoute(roles)
  if (!next) return fallback

  const candidate = next
  const pathname = candidate.split("?")[0].split("#")[0]

  if (
    !pathname.startsWith(`${DASHBOARD_PREFIX}/`) ||
    candidate === DASHBOARD_PREFIX ||
    candidate === `${DASHBOARD_PREFIX}/` ||
    candidate.startsWith(`${DASHBOARD_PREFIX}//`) ||
    candidate.includes("\\") ||
    !isDashboardRouteAllowed(pathname, roles)
  ) {
    return fallback
  }

  return candidate
}
