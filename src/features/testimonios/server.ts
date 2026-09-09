import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getTestimonios } from "./api/getTestimonios";
import { testimoniosQueryKeys } from "./model/query-keys";

export function testimoniosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: testimoniosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getTestimonios(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
