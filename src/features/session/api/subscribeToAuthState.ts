import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

type TSessionEventListener = () => void

interface ISubscribeToAuthStateResult {
  data: { unsubscribe: () => void } | null
  error: string | null
}

export function subscribeToAuthState(listener: TSessionEventListener): ISubscribeToAuthStateResult {
  try {
    const supabase = createSupabaseBrowserClient()
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        listener()
      }
    })

    return {
      data: { unsubscribe: () => data.subscription.unsubscribe() },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo sincronizar la sesi\u00f3n",
    }
  }
}
