import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

export interface ISignUpParams {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}

interface ISignUpResult {
  data: { userId: string } | null
  error: string | null
}

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  phone,
}: ISignUpParams): Promise<ISignUpResult> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombres: firstName,
        apellidos: lastName,
        celular: phone,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    return { data: null, error: error.code ?? error.message }
  }

  if (!data.user) {
    return { data: null, error: "unknown_error" }
  }

  return { data: { userId: data.user.id }, error: null }
}