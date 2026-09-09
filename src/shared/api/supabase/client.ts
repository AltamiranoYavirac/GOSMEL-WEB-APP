import { createBrowserClient } from "@supabase/ssr"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey)
  }

  browserClient ??= createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey)
  return browserClient
}
