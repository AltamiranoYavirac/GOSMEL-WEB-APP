import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildSeccionUpdatePayload, type ISeccionFormValues } from "../model/SeccionForm.config";

export async function actualizarSeccion(id: string, values: ISeccionFormValues, publicId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("secciones_institucionales")
    .update(buildSeccionUpdatePayload(values, publicId))
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) return { data: null, error: error?.message ?? "No se pudo actualizar la sección." };
  return { data, error: null };
}
