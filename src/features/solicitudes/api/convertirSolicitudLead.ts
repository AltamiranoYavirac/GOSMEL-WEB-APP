import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IConvertirSolicitudLeadInput {
  solicitudId: string;
  catedraId?: string | null;
}

export interface IConvertirSolicitudLeadResult {
  solicitud_id: string;
  estudiante_id: string;
  representante_id: string | null;
  inscripcion_id: string | null;
}

export async function convertirSolicitudLead(input: IConvertirSolicitudLeadInput): Promise<{
  data: IConvertirSolicitudLeadResult | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc("convertir_solicitud_lead", {
    p_solicitud_id: input.solicitudId,
    p_catedra_id: input.catedraId || undefined,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as unknown as IConvertirSolicitudLeadResult, error: null };
}