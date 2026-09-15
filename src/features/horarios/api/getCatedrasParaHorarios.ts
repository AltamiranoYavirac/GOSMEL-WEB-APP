import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

export interface ICatedraSelectOption {
  id: string;
  label: string;
  fechaInicio: string;
  fechaFin: string | null;
  activos: number;
  pendientes: number;
}

export async function getCatedrasParaHorarios(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ICatedraSelectOption[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("catedras")
    .select("id, codigo, fecha_inicio, fecha_fin, cursos(nombre), inscripciones!inscripciones_catedra_id_fkey(estado)")
    .in("estado", ["planificada", "en_curso"])
    .order("codigo", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const options: ICatedraSelectOption[] = (data ?? []).map((c) => {
    const inscripciones = c.inscripciones ?? [];

    return {
      id: c.id,
      label: `${c.codigo} · ${c.cursos?.nombre ?? "Sin curso"}`,
      fechaInicio: c.fecha_inicio,
      fechaFin: c.fecha_fin,
      activos: inscripciones.filter((item) => item.estado === "activa").length,
      pendientes: inscripciones.filter((item) => item.estado === "pendiente").length,
    };
  });

  return { data: options, error: null };
}
