import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getEvaluaciones } from "./api/getEvaluaciones";
import { evaluacionesQueryKeys } from "./model/query-keys";

export function evaluacionesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: evaluacionesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getEvaluaciones(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
