import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICrearAcuerdoInput {
  estudianteId: string;
  responsableRepresentanteId?: string;
  montoMensual: number;
  diaCobro: number;
  fechaInicio: string;
  fechaFin?: string | null;
  motivoAjuste?: string | null;
  observaciones?: string | null;
}

export async function crearAcuerdo(
  input: ICrearAcuerdoInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .rpc("crear_acuerdo_pago" as never, {
      p_estudiante_id: input.estudianteId,
      p_responsable_representante_id: input.responsableRepresentanteId || null,
      p_monto_mensual: input.montoMensual,
      p_dia_cobro: input.diaCobro || 5,
      p_fecha_inicio: input.fechaInicio,
      p_fecha_fin: input.fechaFin || null,
      p_motivo_ajuste: input.motivoAjuste?.trim() || null,
      p_observaciones: input.observaciones?.trim() || null,
    } as never);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ? { id: data as string } : null, error: null };
}
