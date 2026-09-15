import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function cambiarResponsableAcuerdo(input: {
  acuerdoId: string;
  representanteId: string | null;
  motivo: string;
}): Promise<{ data: null; error: string | null }> {
  const { error } = await createSupabaseBrowserClient().rpc("cambiar_responsable_acuerdo" as never, {
    p_acuerdo_id: input.acuerdoId,
    p_representante_id: input.representanteId,
    p_motivo: input.motivo.trim(),
  } as never);
  return error ? { data: null, error: error.message } : { data: null, error: null };
}
