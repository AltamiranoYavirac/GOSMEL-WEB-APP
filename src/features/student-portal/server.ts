import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getStudentContext } from "./api/getStudentContext";
import { studentQueryKeys } from "./model/query-keys";

export function studentContextQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: studentQueryKeys.context(),
    queryFn: async () => {
      const { data, error } = await getStudentContext(supabase);
      if (error || !data) throw new Error(error ?? "No se pudo cargar el contexto");
      return data;
    },
  };
}
