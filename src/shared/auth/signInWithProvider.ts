import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

export type TAuthProvider = "google" | "discord"

interface ISignInWithProviderParams {
  provider: TAuthProvider
}

interface ISignInWithProviderResult {
  error: string | null
}

export async function signInWithProvider({
  provider,
}: ISignInWithProviderParams): Promise<ISignInWithProviderResult> {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { error: error?.message ?? null }
}