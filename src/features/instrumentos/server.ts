import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getInstrumentos } from "./api/getInstrumentos";
import { instrumentosQueryKeys } from "./model/query-keys";

export function instrumentosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: instrumentosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getInstrumentos(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}
