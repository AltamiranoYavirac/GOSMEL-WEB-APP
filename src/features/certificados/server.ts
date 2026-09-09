import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getCertificados } from "./api/getCertificados";
import { certificadosQueryKeys } from "./model/query-keys";

export function certificadosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: certificadosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCertificados(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}
