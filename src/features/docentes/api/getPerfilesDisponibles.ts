import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IPerfilDisponible } from "../model/docente.types";

export async function getPerfilesDisponibles(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IPerfilDisponible[] | null;
  error: string | null;
}> {

  const [profsRes, docsRes, estsRes] = await Promise.all([
    supabase.from("perfiles").select("id, nombres, apellidos, email").limit(200),
    supabase.from("docentes").select("perfil_id"),
    supabase.from("estudiantes").select("perfil_id"),
  ]);

  const firstError = profsRes.error ?? docsRes.error ?? estsRes.error;
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const docIds = new Set((docsRes.data ?? []).map((d) => d.perfil_id));
  const estIds = new Set((estsRes.data ?? []).map((e) => e.perfil_id));

  const disponibles: IPerfilDisponible[] = (profsRes.data ?? [])
    .filter((p) => !docIds.has(p.id) && !estIds.has(p.id))
    .map((p) => ({
      id: p.id,
      nombre: `${p.nombres} ${p.apellidos}`.trim(),
      email: p.email,
    }));

  return { data: disponibles, error: null };
}
