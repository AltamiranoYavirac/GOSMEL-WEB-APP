import { createSupabaseServerClient } from "@/shared/api/supabase/server"

interface IExchangeOAuthCodeResult {
  data: null
  error: string | null
}

export async function exchangeOAuthCode(code: string): Promise<IExchangeOAuthCodeResult> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  return { data: null, error: error?.message ?? null }
}
