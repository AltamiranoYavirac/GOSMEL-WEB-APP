import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getMateriales } from "./api/getMateriales";
import { materialesQueryKeys } from "./model/query-keys";

export function materialesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: materialesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getMateriales(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
