import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getGaleria } from "./api/getGaleria";
import { getPublicGaleria } from "./api/getPublicGaleria";
import { galeriaQueryKeys } from "./model/query-keys";

export { getPublicGaleria };

export function galeriaListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: galeriaQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getGaleria(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
