import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IReasignarCatedrasInput {
  catedraIds: string[];
  docenteId: string;
}

export async function reasignarCatedras(
  input: IReasignarCatedrasInput
): Promise<{ data: { actualizadas: number } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc("reasignar_catedras", {
    p_catedra_ids: input.catedraIds,
    p_docente_id: input.docenteId,
  });

  if (error || data === null) {
    return { data: null, error: error?.message ?? "No se pudo reasignar la cátedra" };
  }

  return { data: { actualizadas: data }, error: null };
}
