import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

import { env } from "@/shared/config/env"
import type { Database } from "@/shared/api/supabase/database.types"

interface ISignOutServerResult {
  data: null
  error: string | null
}

export async function signOutServer(
  request: NextRequest,
  response: NextResponse,
): Promise<ISignOutServerResult> {
  const supabase = createServerClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.signOut()
  return { data: null, error: error?.message ?? null }
}
