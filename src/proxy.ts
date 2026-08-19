import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { resolveHomeRoute, type TRol } from "@/entities/user"
import { updateSession } from "@/shared/api/supabase/proxy"

const PROTECTED_PREFIX = "/dashboard"
const AUTH_ROUTES = ["/login", "/register"]

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated, userRoles } = await updateSession(request)
  const { pathname } = request.nextUrl

  if (pathname.startsWith(PROTECTED_PREFIX) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(resolveHomeRoute(userRoles as TRol[]), request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
}
