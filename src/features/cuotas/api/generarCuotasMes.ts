import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function generarCuotasMes(
  mes: string
): Promise<{ data: number | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const formattedMes = mes.length === 7 ? `${mes}-01` : mes;

  const { data: rpcData, error: rpcError } = await supabase.rpc("generar_cuotas_mes" as any, {
    p_mes: formattedMes,
  });

  if (!rpcError && rpcData !== null && rpcData !== undefined) {
    return { data: Number(rpcData), error: null };
  }

  if (rpcError && !rpcError.message.includes("Could not find the function")) {
    return { data: null, error: rpcError.message };
  }

  const { data: acuerdos, error: acuerdosError } = await supabase
    .from("acuerdos_pago")
    .select("id, estudiante_id, monto_mensual, dia_cobro, fecha_inicio, fecha_fin, estado")
    .eq("estado", "vigente");

  if (acuerdosError) {
    return { data: null, error: acuerdosError.message };
  }

  const { data: existingCuotas, error: cuotasError } = await supabase
    .from("cuotas")
    .select("acuerdo_id")
    .eq("periodo_mes", formattedMes);

  if (cuotasError) {
    return { data: null, error: cuotasError.message };
  }

  const existingAcuerdoIds = new Set((existingCuotas ?? []).map((c) => c.acuerdo_id));
  const missingAcuerdos = (acuerdos ?? []).filter((a) => !existingAcuerdoIds.has(a.id));

  if (missingAcuerdos.length === 0) {
    return { data: 0, error: null };
  }

  const [yearStr, monthStr] = formattedMes.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const newCuotas = missingAcuerdos.map((acuerdo) => {
    const dia = Math.min(Math.max(acuerdo.dia_cobro || 5, 1), 28);
    const vencimiento = `${year}-${String(month).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    return {
      acuerdo_id: acuerdo.id,
      periodo_mes: formattedMes,
      monto: Number(acuerdo.monto_mensual),
      monto_pagado: 0,
      estado: "pendiente" as const,
      fecha_vencimiento: vencimiento,
    };
  });

  const { error: insertError } = await supabase.from("cuotas").insert(newCuotas);
  if (insertError) {
    return { data: null, error: insertError.message };
  }

  return { data: newCuotas.length, error: null };
}