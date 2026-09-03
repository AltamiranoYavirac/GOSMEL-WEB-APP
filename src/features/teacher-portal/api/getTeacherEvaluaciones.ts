import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITeacherEvaluacion, TTipoEvaluacion } from "../model/teacher-dashboard.types";

export async function getTeacherEvaluaciones(): Promise<{
  data: ITeacherEvaluacion[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
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

  const [evaluacionesRes, inscripcionesRes] = await Promise.all([
    supabase
      .from("evaluaciones")
      .select(
        "id, titulo, tipo, fecha, ponderacion, nota_maxima, catedra_id, catedras!evaluaciones_catedra_id_fkey(codigo, cursos(nombre)), calificaciones(nota)"
      )
      .in("catedra_id", catedraIds)
      .order("fecha", { ascending: false })
      .limit(100),
    supabase
      .from("inscripciones")
      .select("id, catedra_id")
      .in("catedra_id", catedraIds)
      .in("estado", ["activa", "pendiente"]),
  ]);

  if (evaluacionesRes.error) {
    return { data: null, error: evaluacionesRes.error.message };
  }

  const inscritosPorCatedra = new Map<string, number>();
  for (const item of inscripcionesRes.data ?? []) {
    inscritosPorCatedra.set(item.catedra_id, (inscritosPorCatedra.get(item.catedra_id) ?? 0) + 1);
  }

  const items: ITeacherEvaluacion[] = (evaluacionesRes.data ?? []).map((ev) => {
    const notas = (ev.calificaciones ?? [])
      .map((item) => item.nota)
      .filter((n): n is number => typeof n === "number");
    const promedio = notas.length > 0 ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)) : null;

    return {
      id: ev.id,
      titulo: ev.titulo,
      tipo: ev.tipo as TTipoEvaluacion,
      fecha: ev.fecha,
      catedraId: ev.catedra_id,
      catedra: ev.catedras?.codigo ?? "—",
      curso: ev.catedras?.cursos?.nombre ?? "—",
      notaMaxima: ev.nota_maxima,
      ponderacion: ev.ponderacion,
      rendidas: notas.length,
      totalEstudiantes: inscritosPorCatedra.get(ev.catedra_id) ?? 0,
      promedio,
    };
  });

  return { data: items, error: null };
}
