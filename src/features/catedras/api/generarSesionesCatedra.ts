import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IGenerarSesionesInput {
  catedraId: string;
  fechaDesde: string;
  fechaHasta: string;
}

export async function generarSesionesCatedra(input: IGenerarSesionesInput): Promise<{
  data: number | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rpcData, error: rpcError } = await supabase.rpc("generar_sesiones_catedra", {
    p_catedra_id: input.catedraId,
    p_fecha_desde: input.fechaDesde,
    p_fecha_hasta: input.fechaHasta,
  });

  if (rpcError) {
    return { data: null, error: rpcError.message };
  }

  return { data: Number(rpcData) || 0, error: null };
}