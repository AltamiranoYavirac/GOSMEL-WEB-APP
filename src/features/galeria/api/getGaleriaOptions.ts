import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IGaleriaCursoOption } from "../model/galeria-option.types";

export async function getGaleriaOptions(): Promise<{
  data: IGaleriaCursoOption[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("cursos")
    .select("id, nombre")
    .order("nombre", { ascending: true })
    .limit(300);

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}
