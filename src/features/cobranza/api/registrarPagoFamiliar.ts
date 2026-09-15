import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IPagoItemInput {
  cuotaId: string;
  monto: number;
}

export interface IRegistrarPagoFamiliarInput {
  pagos: IPagoItemInput[];
  responsableId: string;
  responsableTipo: "representante" | "estudiante";
  metodo: string;
  referencia?: string;
  observacion?: string;
}

export async function registrarPagoFamiliar(input: IRegistrarPagoFamiliarInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const today = new Date().toISOString().slice(0, 10);

  const activePagos = input.pagos.filter((p) => p.monto > 0);

  if (activePagos.length === 0) {
    return { error: "No se seleccionaron montos válidos para registrar" };
  }

  const { error } = await supabase.rpc("registrar_cobro", {
    p_responsable_representante_id: input.responsableTipo === "representante" ? input.responsableId : null,
    p_responsable_estudiante_id: input.responsableTipo === "estudiante" ? input.responsableId : null,
    p_fecha_pago: today, p_metodo: input.metodo as never, p_referencia: input.referencia?.trim() || null,
    p_comprobante_storage_path: null, p_observacion: input.observacion?.trim() || null, p_origen: "admin",
    p_aplicaciones: activePagos.map((p) => ({ cuota_id: p.cuotaId, monto: p.monto })),
  } as never);
  return { error: error?.message ?? null };
}
