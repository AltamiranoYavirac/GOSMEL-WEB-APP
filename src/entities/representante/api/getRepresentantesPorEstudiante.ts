import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";
import type { IRepresentanteRow } from "../model/representante.types";

export async function getRepresentantesPorEstudiante(
  estudianteId: string,
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{ data: IRepresentanteRow[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from("representantes")
    .select("id, nombres, apellidos, cedula, celular, email, direccion, ocupacion, perfil_id, estudiante_representante!inner(estudiante_id)")
    .eq("estudiante_representante.estudiante_id", estudianteId)
    .order("apellidos", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data: (data ?? []).map((r) => ({
    id: r.id, nombres: r.nombres, apellidos: r.apellidos,
    nombre: `${r.nombres ?? ""} ${r.apellidos ?? ""}`.trim(), cedula: r.cedula,
    celular: r.celular, email: r.email, direccion: r.direccion, ocupacion: r.ocupacion,
    perfil_id: r.perfil_id, hijos: 1,
  })), error: null };
}
