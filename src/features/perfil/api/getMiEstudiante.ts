import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

export interface IMiEstudiante {
  biografiaCorta: string | null
}

interface IGetMiEstudianteResult {
  data: IMiEstudiante | null
  error: string | null
}

export async function getMiEstudiante(perfilId: string): Promise<IGetMiEstudianteResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("estudiantes")
    .select("biografia_corta")
    .eq("perfil_id", perfilId)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  if (!data) {
    return { data: null, error: null }
  }

  return { data: { biografiaCorta: data.biografia_corta }, error: null }
}
