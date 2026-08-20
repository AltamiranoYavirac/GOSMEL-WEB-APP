import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

interface ISignOutResult {
  error: string | null
}

export async function signOut(): Promise<ISignOutResult> {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()

  return { error: error?.message ?? null }
}
