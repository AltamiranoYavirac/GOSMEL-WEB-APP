import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IEditarContactoFormValues } from "../model/EditarContactoForm.config";

export async function updateUsuarioContacto(
  id: string,
  values: IEditarContactoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("perfiles")
    .update({
      cedula: values.cedula?.trim() || null,
      celular: values.celular?.trim() || null,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}