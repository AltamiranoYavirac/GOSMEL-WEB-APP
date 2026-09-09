import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type {
  ITeacherCatedra,
  ITeacherDashboard,
  ITeacherEstudiante,
  ITeacherEvaluacion,
  ITeacherSesion,
  TEstadoCatedra,
  TEstadoSesion,
  TModalidadCurso,
  TTipoEvaluacion,
} from "../model/teacher-dashboard.types";

export async function getTeacherDashboard(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: ITeacherDashboard | null;
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

  let catedrasQuery = supabase
    .from("catedras")
    .select(
      "id, codigo, curso_id, aula, cupo_maximo, modalidad, estado, cursos(nombre), catedra_horarios(dia_semana, hora_inicio, hora_fin), inscripciones!inscripciones_catedra_id_fkey(estado)"
    )
    .limit(100);

  if (!isAdmin) {
    catedrasQuery = catedrasQuery.eq("docente_id", user.id);
  }

  const [perfil, catedras] = await Promise.all([
    supabase.from("perfiles").select("nombres, apellidos").eq("id", user.id).maybeSingle(),
    catedrasQuery,
  ]);

  if (perfil.error) return { data: null, error: perfil.error.message };
  if (catedras.error) return { data: null, error: catedras.error.message };

  const catedraIds = (catedras.data ?? []).map((c) => c.id);
  const nombreDocente = perfil.data ? `${perfil.data.nombres} ${perfil.data.apellidos}`.trim() : "Docente";

  const catedrasList: ITeacherCatedra[] = (catedras.data ?? []).map((c) => ({
    id: c.id,
    codigo: c.codigo,
    cursoId: c.curso_id,
    curso: c.cursos?.nombre ?? "Sin curso",
    modalidad: c.modalidad as TModalidadCurso,
    aula: c.aula,
    cupoMaximo: c.cupo_maximo,
    inscritos: (c.inscripciones ?? []).filter((item) => item.estado === "activa").length,
    estado: c.estado as TEstadoCatedra,
    horarios: (c.catedra_horarios ?? []).map((h) => ({
      dia: h.dia_semana,
      inicio: h.hora_inicio,
      fin: h.hora_fin,
    })),
  }));

  if (catedraIds.length === 0) {
    return {
      data: {
        nombre: nombreDocente || "Docente",
        counts: {
          catedrasActivas: 0,
          sesionesHoy: 0,
          inscritos: 0,
          evaluacionesPendientes: 0,
        },
        catedras: [],
        estudiantes: [],
        sesionesHoy: [],
        proximasSesiones: [],
        pendientesAsistencia: [],
        pendientesCalificar: [],
      },
      error: null,
    };
  }

  const [sesionesRes, inscripcionesRes, evaluacionesRes] = await Promise.all([
    supabase
      .from("sesiones")
      .select(
        "id, fecha, hora_inicio, hora_fin, tema, estado, catedra_id, catedras!sesiones_catedra_id_fkey(codigo, cursos(nombre)), asistencias(estado)"
      )
      .in("catedra_id", catedraIds)
      .order("fecha", { ascending: true })
      .limit(200),
    supabase
      .from("inscripciones")
      .select(
        "id, estudiante_id, catedra_id, fecha_inscripcion, estado, estudiantes(id, nombres, apellidos, email, celular), catedras(codigo, cursos(nombre))"
      )
      .in("catedra_id", catedraIds)
      .in("estado", ["activa", "pendiente"])
      .limit(300),
    supabase
      .from("evaluaciones")
      .select(
        "id, titulo, tipo, fecha, ponderacion, nota_maxima, catedra_id, catedras!evaluaciones_catedra_id_fkey(codigo, cursos(nombre)), calificaciones(nota)"
      )
      .in("catedra_id", catedraIds)
      .order("fecha", { ascending: false })
      .limit(100),
  ]);

  if (sesionesRes.error) return { data: null, error: sesionesRes.error.message };
  if (inscripcionesRes.error) return { data: null, error: inscripcionesRes.error.message };
  if (evaluacionesRes.error) return { data: null, error: evaluacionesRes.error.message };

  const hoy = new Date().toISOString().slice(0, 10);

  const estudiantesList: ITeacherEstudiante[] = (inscripcionesRes.data ?? []).flatMap((item) => {
    const est = item.estudiantes;
    if (!est) return [];
    return [{
      id: est.id,
      inscripcionId: item.id,
      estudianteId: item.estudiante_id,
      nombre: `${est.nombres} ${est.apellidos}`.trim(),
      email: est.email,
      celular: est.celular,
      catedraId: item.catedra_id,
      catedraCodigo: item.catedras?.codigo ?? "—",
      cursoNombre: item.catedras?.cursos?.nombre ?? "—",
      fechaInscripcion: item.fecha_inscripcion,
      promedioSobre10: null,
      evaluacionesRendidas: 0,
      porcentajeAsistencia: null,
      asistenciasPresentes: 0,
      totalAsistenciasRegistradas: 0,
    }];
  });

  const todasSesiones: ITeacherSesion[] = (sesionesRes.data ?? []).map((s) => {
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

  const todasEvaluaciones: ITeacherEvaluacion[] = (evaluacionesRes.data ?? []).map((ev) => {
    const notas = (ev.calificaciones ?? [])
      .map((item) => item.nota)
      .filter((n): n is number => typeof n === "number");
    const promedio = notas.length > 0 ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)) : null;
    const inscritosCatedra = estudiantesList.filter((e) => e.catedraId === ev.catedra_id).length;

    return {
      id: ev.id,
      catedraId: ev.catedra_id,
      titulo: ev.titulo,
      tipo: ev.tipo as TTipoEvaluacion,
      catedra: ev.catedras?.codigo ?? "—",
      curso: ev.catedras?.cursos?.nombre ?? "—",
      fecha: ev.fecha,
      ponderacion: Number(ev.ponderacion),
      notaMaxima: Number(ev.nota_maxima),
      promedio,
      rendidas: notas.length,
      totalEstudiantes: inscritosCatedra,
    };
  });

  const sesionesHoy = todasSesiones.filter((s) => s.fecha === hoy);
  const proximasSesiones = todasSesiones.filter((s) => s.fecha >= hoy).slice(0, 8);
  const pendientesAsistencia = todasSesiones
    .filter((s) => s.fecha <= hoy && s.totalAsistencia === 0 && s.estado !== "cancelada")
    .slice(0, 6);
  const pendientesCalificar = todasEvaluaciones
    .filter((ev) => ev.rendidas < ev.totalEstudiantes && ev.totalEstudiantes > 0)
    .slice(0, 6);

  return {
    data: {
      nombre: nombreDocente || "Docente",
      counts: {
        catedrasActivas: catedrasList.filter((c) => c.estado === "en_curso" || c.estado === "planificada").length,
        sesionesHoy: sesionesHoy.length,
        inscritos: estudiantesList.length,
        evaluacionesPendientes: pendientesCalificar.length,
      },
      catedras: catedrasList,
      estudiantes: estudiantesList,
      sesionesHoy,
      proximasSesiones,
      pendientesAsistencia,
      pendientesCalificar,
    },
    error: null,
  };
}