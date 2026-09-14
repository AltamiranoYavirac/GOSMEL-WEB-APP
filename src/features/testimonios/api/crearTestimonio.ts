import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildTestimonioPayload, type ITestimonioFormValues } from "../model/TestimonioForm.config";

export async function crearTestimonio(values: ITestimonioFormValues) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("testimonios").insert(buildTestimonioPayload(values)).select("id").single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
