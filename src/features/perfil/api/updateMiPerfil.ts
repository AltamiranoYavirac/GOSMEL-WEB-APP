import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

import { buildDatosCuentaPayload, type IDatosCuentaFormValues } from "../model/DatosCuentaForm.config"

interface IUpdateMiPerfilResult {
  data: { id: string } | null
  error: string | null
}

export async function updateMiPerfil(
  id: string,
  values: IDatosCuentaFormValues
): Promise<IUpdateMiPerfilResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("perfiles")
    .update(buildDatosCuentaPayload(values))
    .eq("id", id)
    .select("id")
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
