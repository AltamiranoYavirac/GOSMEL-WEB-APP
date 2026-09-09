import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getProgramas } from "./api/getProgramas";
import { programasQueryKeys } from "./model/query-keys";

export function programasListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: programasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getProgramas(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
