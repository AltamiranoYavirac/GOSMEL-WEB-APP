import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { createSupabaseServerClient } from "@/shared/api/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard/student"

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Flujos con token (confirmación de email, OTP) los procesa el
  // cliente en /login conservando los parámetros de la URL.
  const loginUrl = new URL("/login", origin)
  searchParams.forEach((value, key) => loginUrl.searchParams.set(key, value))
  return NextResponse.redirect(loginUrl)
}