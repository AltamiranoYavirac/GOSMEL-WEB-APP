import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getResenas } from "./api/getResenas";
import { resenasQueryKeys } from "./model/query-keys";

export function resenasListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: resenasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getResenas(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}
