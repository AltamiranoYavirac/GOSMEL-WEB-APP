import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

import type { TAuthProvider } from "../model/auth.types"

interface ISignInWithProviderParams {
  provider: TAuthProvider
  nextPath?: string
}

interface ISignInWithProviderResult {
  data: null
  error: string | null
}

export async function signInWithProvider({
  provider,
  nextPath,
}: ISignInWithProviderParams): Promise<ISignInWithProviderResult> {
  const supabase = createSupabaseBrowserClient()
  const callbackUrl = new URL("/auth/callback", window.location.origin)
  if (nextPath) callbackUrl.searchParams.set("next", nextPath)

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callbackUrl.toString() },
  })

  return { data: null, error: error?.message ?? null }
}
