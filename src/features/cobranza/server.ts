import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getCobranza } from "./api/getCobranza";
import { cobranzaQueryKeys } from "./model/query-keys";

export function cobranzaListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: cobranzaQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCobranza(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
