import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

export interface IMiPerfil {
  nombres: string
  apellidos: string
  cedula: string | null
  celular: string | null
}

interface IGetMiPerfilResult {
  data: IMiPerfil | null
  error: string | null
}

export async function getMiPerfil(id: string): Promise<IGetMiPerfilResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("perfiles")
    .select("nombres, apellidos, cedula, celular")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  if (!data) {
    return { data: null, error: "No se encontró el perfil" }
  }

  return {
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      celular: data.celular,
    },
    error: null,
  }
}
