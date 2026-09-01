import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IPagoItemInput {
  cuotaId: string;
  monto: number;
}

export interface IRegistrarPagoFamiliarInput {
  pagos: IPagoItemInput[];
  metodo: string;
  referencia?: string;
  observacion?: string;
}

export async function registrarPagoFamiliar(input: IRegistrarPagoFamiliarInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data: userData } = await supabase.auth.getUser();
  const currentUid = userData?.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  const activePagos = input.pagos.filter((p) => p.monto > 0);

  if (activePagos.length === 0) {
    return { error: "No se seleccionaron montos válidos para registrar" };
  }

  const inserts = activePagos.map((p) => ({
    cuota_id: p.cuotaId,
    monto: p.monto,
    metodo: input.metodo,
    referencia: input.referencia?.trim() || null,
    observacion: input.observacion?.trim() || null,
    registrado_por: currentUid || null,
    fecha_pago: today,
  }));

  const { error } = await supabase.from("pagos").insert(inserts);

  if (error) {
    return { error: error.message };
  }

  for (const item of activePagos) {
    const { data: pagos } = await supabase.from("pagos").select("monto").eq("cuota_id", item.cuotaId);
    const totalPagado = (pagos ?? []).reduce((suma, p) => suma + Number(p.monto), 0);
    const { data: cuota } = await supabase.from("cuotas").select("monto").eq("id", item.cuotaId).single();
    const montoCuota = cuota?.monto ?? 0;
    const estado: "pagada" | "parcial" = totalPagado >= montoCuota ? "pagada" : "parcial";

    await supabase
      .from("cuotas")
      .update({
        monto_pagado: totalPagado,
        estado,
        fecha_pago: today,
      })
      .eq("id", item.cuotaId);
  }

  return { error: null };
}
