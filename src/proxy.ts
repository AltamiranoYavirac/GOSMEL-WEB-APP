import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { updateSession } from "@/shared/api/supabase/proxy"

const PROTECTED_PREFIX = "/dashboard"
const AUTH_ROUTES = ["/login", "/register"]

export async function proxy(request: NextRequest) {
  const { response, isAuthenticated } = await updateSession(request)
  const { pathname } = request.nextUrl
  const isDashboardRoute = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`)

  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
}
