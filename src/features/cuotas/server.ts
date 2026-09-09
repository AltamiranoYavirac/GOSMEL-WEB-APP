import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getCuotas } from "./api/getCuotas";
import { cuotasQueryKeys } from "./model/query-keys";

export function cuotasListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: cuotasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCuotas(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
