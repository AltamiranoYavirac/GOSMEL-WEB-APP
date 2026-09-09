import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";
import { getInscripcionesPendientes, matriculasQueryKeys } from "@/entities/matricula";

export function matriculasPendientesQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: matriculasQueryKeys.pendientes(),
    queryFn: async () => {
      const { data, error } = await getInscripcionesPendientes(undefined, supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
