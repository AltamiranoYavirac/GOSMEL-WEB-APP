import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getDocentes } from "./api/getDocentes";
import { docentesQueryKeys } from "./model/query-keys";

export function docentesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: docentesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getDocentes(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
