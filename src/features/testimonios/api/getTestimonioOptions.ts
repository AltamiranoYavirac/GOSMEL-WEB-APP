import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITestimonioCursoOption } from "../model/testimonio.types";

export async function getTestimonioOptions(): Promise<{
  data: ITestimonioCursoOption[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("cursos").select("id, nombre").order("nombre");
  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}
