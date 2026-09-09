import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ITeacherSesion, TEstadoSesion } from "../model/teacher-dashboard.types";

export async function getTeacherSesiones(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ITeacherSesion[] | null;
  error: string | null;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const { data: rolData } = await supabase
    .from("perfil_rol")
    .select("rol")
    .eq("perfil_id", user.id);
  const isAdmin = (rolData ?? []).some((r) => r.rol === "admin");

  let catedrasQuery = supabase.from("catedras").select("id");
  if (!isAdmin) {
    catedrasQuery = catedrasQuery.eq("docente_id", user.id);
  }

  const { data: catedras, error: catedrasError } = await catedrasQuery;

  if (catedrasError) return { data: null, error: catedrasError.message };

  const catedraIds = (catedras ?? []).map((c) => c.id);
  if (catedraIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("sesiones")
    .select(
      "id, fecha, hora_inicio, hora_fin, tema, estado, catedra_id, catedras!sesiones_catedra_id_fkey(codigo, cursos(nombre)), asistencias(estado)"
    )
    .in("catedra_id", catedraIds)
    .order("fecha", { ascending: false })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const items: ITeacherSesion[] = (data ?? []).map((s) => {
    const asistencias = s.asistencias ?? [];
    return {
      id: s.id,
      catedraId: s.catedra_id,
      catedra: s.catedras?.codigo ?? "Sin código",
      curso: s.catedras?.cursos?.nombre ?? "—",
      fecha: s.fecha,
      inicio: s.hora_inicio,
      fin: s.hora_fin,
      tema: s.tema,
      presentes: asistencias.filter((a) => a.estado === "presente").length,
      totalAsistencia: asistencias.length,
      estado: s.estado as TEstadoSesion,
    };
  });

  return { data: items, error: null };
}
