import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";
import { getCatedras, catedrasQueryKeys } from "@/entities/catedra";

export function catedrasListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: catedrasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCatedras(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
