import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICrearAcuerdoInput {
  estudianteId: string;
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
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("acuerdos_pago")
    .insert({
      estudiante_id: input.estudianteId,
      monto_mensual: input.montoMensual,
      dia_cobro: input.diaCobro || 5,
      fecha_inicio: input.fechaInicio,
      fecha_fin: input.fechaFin || null,
      motivo_ajuste: input.motivoAjuste?.trim() || null,
      observaciones: input.observaciones?.trim() || null,
      estado: "vigente",
      acordado_por: userData?.user?.id || null,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
