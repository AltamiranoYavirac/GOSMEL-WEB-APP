import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

/** Compatibilidad del nombre público: ahora finaliza sin borrar historial. */
export interface ICierreResolucion { cuotaId: string; accion: "mantener" | "condonar" | "anular"; motivo?: string }
export async function eliminarAcuerdo(acuerdoId: string, motivo: string, resoluciones: ICierreResolucion[] = []): Promise<{ error: string | null }> {
  const { error } = await createSupabaseBrowserClient().rpc("cerrar_acuerdo" as never, {
    p_acuerdo_id: acuerdoId, p_resoluciones: resoluciones.map((r) => ({ cuota_id: r.cuotaId, accion: r.accion, motivo: r.motivo ?? motivo })), p_motivo: motivo,
  } as never);
  return { error: error?.message ?? null };
}
