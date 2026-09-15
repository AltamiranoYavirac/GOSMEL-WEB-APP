import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildSeccionPayload, type ISeccionFormValues } from "../model/SeccionForm.config";

export async function crearSeccion(values: ISeccionFormValues, publicId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("secciones_institucionales")
    .insert(buildSeccionPayload(values, publicId))
    .select("id")
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
