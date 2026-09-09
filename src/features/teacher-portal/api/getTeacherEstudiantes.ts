import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { ITeacherEstudiante } from "../model/teacher-dashboard.types";

export async function getTeacherEstudiantes(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ITeacherEstudiante[] | null;
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

  const [inscripcionesRes, promediosRes, asistenciasRes] = await Promise.all([
    supabase
      .from("inscripciones")
      .select(
        "id, estudiante_id, catedra_id, fecha_inscripcion, estado, estudiantes(id, nombres, apellidos, email, celular), catedras(codigo, cursos(nombre))"
      )
      .in("catedra_id", catedraIds)
      .in("estado", ["activa", "pendiente"])
      .order("fecha_inscripcion", { ascending: false })
      .limit(300),
    supabase
      .from("v_promedio_academico")
      .select("inscripcion_id, promedio_sobre_10, evaluaciones_rendidas")
      .in("catedra_id", catedraIds),
    supabase
      .from("asistencias")
      .select("inscripcion_id, estado")
      .in(
        "inscripcion_id",
        (await supabase.from("inscripciones").select("id").in("catedra_id", catedraIds)).data?.map(
          (i) => i.id
        ) ?? []
      ),
  ]);

  if (inscripcionesRes.error) return { data: null, error: inscripcionesRes.error.message };

  const promediosMap = new Map(
    (promediosRes.data ?? []).map((p) => [
      p.inscripcion_id,
      {
        promedio: p.promedio_sobre_10 != null ? Number(p.promedio_sobre_10) : null,
        rendidas: p.evaluaciones_rendidas ?? 0,
      },
    ])
  );

  const asistenciasMap = new Map<string, { presentes: number; total: number }>();
  for (const asis of asistenciasRes.data ?? []) {
    const prev = asistenciasMap.get(asis.inscripcion_id) ?? { presentes: 0, total: 0 };
    prev.total += 1;
    if (asis.estado === "presente" || asis.estado === "atraso") {
      prev.presentes += 1;
    }
    asistenciasMap.set(asis.inscripcion_id, prev);
  }

  const rows: ITeacherEstudiante[] = (inscripcionesRes.data ?? []).map((item) => {
    const estudiante = item.estudiantes;
    const catedra = item.catedras;
    const nombreCompleto = [estudiante?.nombres, estudiante?.apellidos].filter(Boolean).join(" ") || "Estudiante";

    const prom = promediosMap.get(item.id);
    const asis = asistenciasMap.get(item.id);

    const porcentaje =
      asis && asis.total > 0 ? Math.round((asis.presentes / asis.total) * 100) : null;

    return {
      id: estudiante?.id ?? item.id,
      inscripcionId: item.id,
      estudianteId: item.estudiante_id,
      nombre: nombreCompleto,
      email: estudiante?.email ?? null,
      celular: estudiante?.celular ?? null,
      catedraId: item.catedra_id,
      catedraCodigo: catedra?.codigo ?? "—",
      cursoNombre: catedra?.cursos?.nombre ?? "Curso",
      fechaInscripcion: item.fecha_inscripcion,
      promedioSobre10: prom?.promedio ?? null,
      evaluacionesRendidas: prom?.rendidas ?? 0,
      porcentajeAsistencia: porcentaje,
      totalAsistenciasRegistradas: asis?.total ?? 0,
      asistenciasPresentes: asis?.presentes ?? 0,
    };
  });

  return { data: rows, error: null };
}
