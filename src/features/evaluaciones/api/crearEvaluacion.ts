import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEvaluacionFormValues } from "../model/EvaluacionForm.config";

export async function crearEvaluacion(
  values: IEvaluacionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("evaluaciones")
    .insert({
      catedra_id: values.catedraId,
      titulo: values.titulo.trim(),
      tipo: values.tipo,
      descripcion: values.descripcion?.trim() || null,
      fecha: values.fecha || null,
      nota_maxima: values.notaMaxima,
      ponderacion: values.ponderacion,
      creada_por: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
