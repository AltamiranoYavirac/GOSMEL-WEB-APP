import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getMetricas } from "./api/getMetricas";
import { metricasQueryKeys } from "./model/query-keys";

export function metricasListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: metricasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getMetricas(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
