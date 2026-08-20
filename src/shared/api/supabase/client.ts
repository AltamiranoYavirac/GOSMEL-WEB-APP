import { createBrowserClient } from "@supabase/ssr"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey)
}
