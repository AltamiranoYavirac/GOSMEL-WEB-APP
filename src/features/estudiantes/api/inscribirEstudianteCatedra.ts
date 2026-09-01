import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IInscribirEstudianteCatedraInput {
  estudianteId: string;
  catedraId: string;
  montoMensual?: number;
  diaCobro?: number;
  motivoAjuste?: string;
  montoPrimerMes?: number;
}

export async function inscribirEstudianteCatedra(input: IInscribirEstudianteCatedraInput): Promise<{
  data: { inscripcionId: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rpcData, error: rpcError } = await supabase.rpc("matricular_estudiante_directo", {
    p_estudiante_id: input.estudianteId,
    p_catedra_id: input.catedraId,
    p_monto_mensual: input.montoMensual ?? 0,
    p_dia_cobro: input.diaCobro ?? 5,
    p_motivo_ajuste: input.motivoAjuste?.trim() || undefined,
    p_monto_primer_mes: input.montoPrimerMes || undefined,
  });

  if (rpcError) {
    return { data: null, error: rpcError.message };
  }

  return { data: { inscripcionId: String(rpcData) }, error: null };
}