import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IConvertirSolicitudLeadInput {
  solicitudId: string;
  catedraId?: string | null;
}

export async function convertirSolicitudLead(input: IConvertirSolicitudLeadInput): Promise<{
  data: any | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc("convertir_solicitud_lead" as any, {
    p_solicitud_id: input.solicitudId,
    p_catedra_id: input.catedraId || null,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
