import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface ICrearCuotaInput {
  estudianteId: string;
  responsableRepresentanteId?: string;
  monto: number;
  /** Compatibilidad de llamada; un cargo extraordinario no genera mensualidades. */
  periodo?: string;
  fechaVencimiento: string;
  concepto?: string;
}

export async function crearCuota(
  input: ICrearCuotaInput
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  if (!input.concepto?.trim()) return { data: null, error: "El concepto del cargo es obligatorio" };
  const { data, error } = await supabase.rpc("crear_cargo_extraordinario", {
    p_estudiante_id: input.estudianteId,
    p_responsable_representante_id: input.responsableRepresentanteId || null,
    p_monto: input.monto,
    p_fecha_vencimiento: input.fechaVencimiento,
    p_concepto: input.concepto.trim(),
    p_observacion: null,
  } as never);
  return error ? { data: null, error: error.message } : { data: { id: data.id }, error: null };
}
