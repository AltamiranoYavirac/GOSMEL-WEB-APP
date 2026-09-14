import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IReemplazarInstrumentosInput {
  docenteId: string;
  instrumentoIds: string[];
  instrumentoPrincipalId?: string;
}

export async function reemplazarInstrumentosDocente(
  input: IReemplazarInstrumentosInput
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.rpc("reemplazar_instrumentos_docente", {
    p_docente_id: input.docenteId,
    p_instrumento_ids: input.instrumentoIds,
    p_instrumento_principal_id: input.instrumentoPrincipalId || undefined,
  });

  return { error: error?.message ?? null };
}
