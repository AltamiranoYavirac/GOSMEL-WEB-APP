import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import { getUsuarios } from "./api/getUsuarios";
import { usuariosQueryKeys } from "./model/query-keys";

export { updateUsuarioActivoServer } from "./api/updateUsuarioActivoServer";

export function usuariosListQuery(supabase: SupabaseClient<Database>) {
  return {
    queryKey: usuariosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getUsuarios(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}
