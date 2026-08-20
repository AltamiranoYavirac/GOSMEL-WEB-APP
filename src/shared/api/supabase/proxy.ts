import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

export interface IUpdateSessionResult {
  response: NextResponse
  isAuthenticated: boolean
  userRoles: string[]
}

export async function updateSession(request: NextRequest): Promise<IUpdateSessionResult> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const userRoles = (data?.claims.user_roles as string[] | undefined) ?? []

  return { response, isAuthenticated: !!data, userRoles }
}
