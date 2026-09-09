import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getEstudiantes } from "./api/getEstudiantes";
import { estudiantesQueryKeys } from "./model/query-keys";

export function estudiantesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: estudiantesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getEstudiantes(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
