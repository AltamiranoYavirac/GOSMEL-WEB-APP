import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getSolicitudes } from "./api/getSolicitudes";
import { solicitudesQueryKeys } from "./model/query-keys";

export function solicitudesListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: solicitudesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getSolicitudes(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
