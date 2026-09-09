import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";
import { getSiteConfig, siteConfigQueryKeys } from "@/entities/site-config";

export function siteConfigQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: siteConfigQueryKeys.detail(),
    queryFn: async () => {
      const { data, error } = await getSiteConfig(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}
