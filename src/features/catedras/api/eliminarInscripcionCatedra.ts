import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function eliminarInscripcionCatedra(
  inscripcionId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data: acuerdos } = await supabase
    .from("acuerdos_pago")
    .select("id")
    .eq("inscripcion_id", inscripcionId);

  const acuerdoIds = (acuerdos ?? []).map((a) => a.id);
  if (acuerdoIds.length > 0) {
    await supabase
      .from("acuerdos_pago")
      .update({ inscripcion_id: null })
      .in("id", acuerdoIds);

    await supabase
      .from("cuotas")
      .delete()
      .in("acuerdo_id", acuerdoIds)
      .eq("monto_pagado", 0);

    for (const acuerdoId of acuerdoIds) {
      const { count } = await supabase
        .from("cuotas")
        .select("id", { count: "exact", head: true })
        .eq("acuerdo_id", acuerdoId);

      if (count === 0) {
        await supabase.from("acuerdos_pago").delete().eq("id", acuerdoId);
      }
    }
  }

  const { error } = await supabase
    .from("inscripciones")
    .delete()
    .eq("id", inscripcionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
