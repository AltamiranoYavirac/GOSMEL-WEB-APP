import { createClient } from "@supabase/supabase-js"

import { env } from "@/shared/config/env"
import type { Database } from "./database.types"

function getSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error("Falta SUPABASE_SECRET_KEY para operaciones administrativas")
  }
  return key
}

export function createSupabaseAdminClient() {
  return createClient<Database>(env.supabaseUrl, getSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
