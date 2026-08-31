import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ILeccionFormValues } from "../model/LeccionForm.config";

export async function crearLeccion(
  moduloId: string,
  values: ILeccionFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("curso_lecciones")
    .insert({
      modulo_id: moduloId,
      titulo: values.titulo.trim(),
      descripcion: values.descripcion?.trim() || null,
      duracion_minutos: values.duracionMinutos || null,
      es_muestra: values.esMuestra,
      orden: values.orden,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
