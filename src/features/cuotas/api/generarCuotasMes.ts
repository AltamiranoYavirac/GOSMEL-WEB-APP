import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function generarCuotasMes(
  mes: string
): Promise<{ data: number | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const formattedMes = mes.length === 7 ? `${mes}-01` : mes;

  const { data: rpcData, error: rpcError } = await supabase.rpc("generar_cuotas_mes", {
    p_mes: formattedMes,
  });

  if (rpcError) {
    return { data: null, error: rpcError.message };
  }

  return { data: Number(rpcData) || 0, error: null };
}