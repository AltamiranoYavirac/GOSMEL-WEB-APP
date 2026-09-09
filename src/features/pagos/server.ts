import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getPagos } from "./api/getPagos";
import { pagosQueryKeys } from "./model/query-keys";

export function pagosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: pagosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getPagos(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
