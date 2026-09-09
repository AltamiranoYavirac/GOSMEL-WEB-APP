import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

import { buildContactPayload, type IContactFormValues } from "../model/contactForm.config"

export interface IEnviarSolicitudInput extends IContactFormValues {
  origenUrl: string
}

export interface IEnviarSolicitudPayload {
  tipo: IContactFormValues["tipo"]
  nombre_completo: string
  email: string
  telefono: string | null
  instrumento_id: string | null
  mensaje: string
  para_menor: boolean
  consentimiento_datos: boolean
  origen_url: string
}

export async function enviarSolicitud(input: IEnviarSolicitudInput): Promise<{
  data: { id: string } | null
  error: string | null
}> {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase
    .from("solicitudes")
    .insert(buildContactPayload(input, input.origenUrl))

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}
