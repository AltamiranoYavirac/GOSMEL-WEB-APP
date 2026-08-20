import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Se llama desde un Server Component: la sesión ya la refresca el proxy.
        }
      },
    },
  })
}
