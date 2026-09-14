import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";
import { getInstrumentoOptions } from "@/entities/instrument";

import type { ICursoOptions } from "../model/curso-option.types";

export async function getCursoOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICursoOptions | null;
  error: string | null;
}> {
  const [instrumentosResult, ultimoCursoResult] = await Promise.all([
    getInstrumentoOptions(supabase),
    supabase
      .from("cursos")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const firstError = instrumentosResult.error ?? ultimoCursoResult.error?.message ?? null;
  if (firstError) {
    return { data: null, error: firstError };
  }

  return {
    data: {
      instrumentos: instrumentosResult.data ?? [],
      nextOrden: (ultimoCursoResult.data?.orden ?? 0) + 1,
    },
    error: null,
  };
}
