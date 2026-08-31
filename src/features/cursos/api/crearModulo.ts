import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IModuloFormValues } from "../model/ModuloForm.config";

export async function crearModulo(
  cursoId: string,
  values: IModuloFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("curso_modulos")
    .insert({
      curso_id: cursoId,
      titulo: values.titulo.trim(),
      descripcion: values.descripcion?.trim() || null,
      orden: values.orden,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
