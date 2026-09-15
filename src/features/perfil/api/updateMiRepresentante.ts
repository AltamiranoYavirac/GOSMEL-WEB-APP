import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

import { buildDatosRepresentantePayload, type IDatosRepresentanteFormValues } from "../model/DatosRepresentanteForm.config"

interface IUpdateMiRepresentanteResult {
  data: { id: string } | null
  error: string | null
}

export async function updateMiRepresentante(
  perfilId: string,
  values: IDatosRepresentanteFormValues
): Promise<IUpdateMiRepresentanteResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("representantes")
    .update(buildDatosRepresentantePayload(values))
    .eq("perfil_id", perfilId)
    .select("id")
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
