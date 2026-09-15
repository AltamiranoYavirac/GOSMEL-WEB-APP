import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getPublicTestimonios } from "./api/getPublicTestimonios";
import { getTestimonios } from "./api/getTestimonios";
import { testimoniosQueryKeys } from "./model/query-keys";

export { getPublicTestimonios };

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
