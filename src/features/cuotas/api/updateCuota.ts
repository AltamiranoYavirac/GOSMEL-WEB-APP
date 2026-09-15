import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IUpdateCuotaInput {
  cuotaId: string;
  monto: number;
  fechaVencimiento: string;
  motivo?: string;
}

export async function updateCuota(
  input: IUpdateCuotaInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.rpc("editar_cuota" as never, {
    p_cuota_id: input.cuotaId, p_monto: input.monto, p_fecha_vencimiento: input.fechaVencimiento,
    p_motivo: input.motivo?.trim() || "Ajuste administrativo",
  } as never);
  return error ? { data: null, error: error.message } : { data: { id: input.cuotaId }, error: null };
}
