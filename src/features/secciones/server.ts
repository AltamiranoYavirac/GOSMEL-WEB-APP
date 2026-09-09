import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getSecciones } from "./api/getSecciones";
import { seccionesQueryKeys } from "./model/query-keys";

export function seccionesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: seccionesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getSecciones(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
