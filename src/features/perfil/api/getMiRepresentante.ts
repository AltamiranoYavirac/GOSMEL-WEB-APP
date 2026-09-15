import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

export interface IMiRepresentante {
  direccion: string | null
  ocupacion: string | null
}

interface IGetMiRepresentanteResult {
  data: IMiRepresentante | null
  error: string | null
}

export async function getMiRepresentante(perfilId: string): Promise<IGetMiRepresentanteResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("representantes")
    .select("direccion, ocupacion")
    .eq("perfil_id", perfilId)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  if (!data) {
    return { data: null, error: null }
  }

  return { data: { direccion: data.direccion, ocupacion: data.ocupacion }, error: null }
}
