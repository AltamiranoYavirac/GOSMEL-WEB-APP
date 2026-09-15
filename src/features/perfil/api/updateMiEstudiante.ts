import { createSupabaseBrowserClient } from "@/shared/api/supabase/client"

import { buildDatosEstudiantePayload, type IDatosEstudianteFormValues } from "../model/DatosEstudianteForm.config"

interface IUpdateMiEstudianteResult {
  data: { id: string } | null
  error: string | null
}

export async function updateMiEstudiante(
  perfilId: string,
  values: IDatosEstudianteFormValues
): Promise<IUpdateMiEstudianteResult> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("estudiantes")
    .update(buildDatosEstudiantePayload(values))
    .eq("perfil_id", perfilId)
    .select("id")
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
