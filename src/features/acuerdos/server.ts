import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getAcuerdos } from "./api/getAcuerdos";
import { acuerdosQueryKeys } from "./model/query-keys";

export function acuerdosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: acuerdosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getAcuerdos(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
