import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITipoInstrumentoFormValues } from "../model/TipoInstrumentoForm.config";

export async function updateTipoInstrumento(
  tipoId: string,
  values: ITipoInstrumentoFormValues,
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tipos_instrumento")
    .update({
      nombre: values.nombre.trim(),
      orden: values.orden,
      activo: values.activo,
    })
    .eq("id", tipoId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
