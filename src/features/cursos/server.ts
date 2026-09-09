import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getCursos } from "./api/getCursos";
import { cursosQueryKeys } from "./model/query-keys";

export function cursosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: cursosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCursos(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
