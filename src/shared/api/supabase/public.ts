import "server-only"

import { createClient } from "@supabase/supabase-js"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

export function createSupabasePublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
