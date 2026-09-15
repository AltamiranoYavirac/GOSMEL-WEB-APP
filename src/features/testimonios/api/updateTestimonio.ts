import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildTestimonioPayload, type ITestimonioFormValues } from "../model/TestimonioForm.config";

export async function updateTestimonio(id: string, values: ITestimonioFormValues, publicId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("testimonios").update(buildTestimonioPayload(values, publicId)).eq("id", id).select("id").maybeSingle();
  if (error || !data) return { data: null, error: error?.message ?? "No se pudo actualizar el testimonio." };
  return { data, error: null };
}
