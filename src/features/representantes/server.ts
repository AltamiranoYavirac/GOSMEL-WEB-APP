import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";
import { getRepresentantes, representantesQueryKeys } from "@/entities/representante";

export function representantesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: representantesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getRepresentantes(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
