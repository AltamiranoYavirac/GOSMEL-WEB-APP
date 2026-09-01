import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IUpdateCuotaInput {
  cuotaId: string;
  monto: number;
  fechaVencimiento: string;
}

export async function updateCuota(
  input: IUpdateCuotaInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: cuota, error: fetchError } = await supabase
    .from("cuotas")
    .select("monto_pagado, estado")
    .eq("id", input.cuotaId)
    .single();

  if (fetchError || !cuota) {
    return { data: null, error: fetchError?.message ?? "Cuota no encontrada" };
  }

  const pagado = Number(cuota.monto_pagado) || 0;
  let nuevoEstado = cuota.estado;
  if (cuota.estado !== "condonada") {
    nuevoEstado = pagado >= input.monto ? "pagada" : pagado > 0 ? "parcial" : "pendiente";
  }

  const { data, error } = await supabase
    .from("cuotas")
    .update({
      monto: input.monto,
      fecha_vencimiento: input.fechaVencimiento,
      estado: nuevoEstado,
    })
    .eq("id", input.cuotaId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
