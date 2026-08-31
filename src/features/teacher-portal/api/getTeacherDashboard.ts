import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  ITeacherDashboard,
  TEstadoCatedra,
  TEstadoSesion,
  TModalidadCurso,
  TTipoEvaluacion,
  TTipoMaterial,
  TVisibilidadMaterial,
} from "../model/teacher-dashboard.types";

export async function getTeacherDashboard(): Promise<{
  data: ITeacherDashboard | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const [perfil, catedras] = await Promise.all([
    supabase.from("perfiles").select("nombres").eq("id", user.id).maybeSingle(),
    supabase
      .from("catedras")
      .select(
        "id, codigo, aula, cupo_maximo, modalidad, estado, cursos(nombre), catedra_horarios(dia_semana, hora_inicio, hora_fin), inscripciones!inscripciones_catedra_id_fkey(estado)"
      )
      .eq("docente_id", user.id)
      .limit(200),
  ]);

  const catedraIds = (catedras.data ?? []).map((catedra) => catedra.id);

  const [sesiones, materiales, evaluaciones, inscritos] = await Promise.all([
    supabase
      .from("sesiones")
      .select(
        "id, fecha, hora_inicio, hora_fin, tema, estado, catedra_id, catedras!sesiones_catedra_id_fkey(codigo, cursos(nombre)), asistencias(estado)"
      )
      .in("catedra_id", catedraIds)
      .order("fecha", { ascending: false })
      .limit(100),
    supabase
      .from("materiales")
      .select("id, titulo, tipo, visible_para, curso_id, catedra_id, cursos(nombre)")
      .in("visible_para", ["docentes", "publico", "registrados"])
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("evaluaciones")
      .select(
        "id, titulo, tipo, fecha, ponderacion, nota_maxima, catedra_id, catedras!evaluaciones_catedra_id_fkey(codigo, cursos(nombre)), calificaciones(nota)"
      )
      .in("catedra_id", catedraIds)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("inscripciones")
      .select("id", { count: "exact", head: true })
      .in("catedra_id", catedraIds)
      .eq("estado", "activa"),
  ]);

  const firstError = [perfil, catedras, sesiones, materiales, evaluaciones, inscritos]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const hoy = new Date().toISOString().slice(0, 10);

  const catedraRows = (catedras.data ?? []).map((catedra) => ({
    id: catedra.id,
    codigo: catedra.codigo,
    curso: catedra.cursos?.nombre ?? "Sin curso",
    modalidad: catedra.modalidad as TModalidadCurso,
    aula: catedra.aula,
    cupoMaximo: catedra.cupo_maximo,
    inscritos: (catedra.inscripciones ?? []).filter((item) => item.estado === "activa").length,
    estado: catedra.estado as TEstadoCatedra,
    horarios: (catedra.catedra_horarios ?? []).map((horario) => ({
      dia: horario.dia_semana,
      inicio: horario.hora_inicio,
      fin: horario.hora_fin,
    })),
  }));

  const sesionRows = (sesiones.data ?? []).map((sesion) => {
    const asistencias = sesion.asistencias ?? [];
    return {
      id: sesion.id,
      catedra: sesion.catedras?.codigo ?? "Sin cátedra",
      curso: sesion.catedras?.cursos?.nombre ?? "—",
      fecha: sesion.fecha,
      inicio: sesion.hora_inicio,
      fin: sesion.hora_fin,
      tema: sesion.tema,
      presentes: asistencias.filter((item) => item.estado === "presente").length,
      totalAsistencia: asistencias.length,
      estado: sesion.estado as TEstadoSesion,
    };
  });

  const materialRows = (materiales.data ?? []).map((material) => ({
    id: material.id,
    titulo: material.titulo,
    tipo: material.tipo as TTipoMaterial,
    visibilidad: material.visible_para as TVisibilidadMaterial,
    destino: material.cursos?.nombre ?? "General",
  }));

  const evaluacionRows = (evaluaciones.data ?? []).map((evaluacion) => {
    const notas = (evaluacion.calificaciones ?? [])
      .map((item) => item.nota)
      .filter((nota): nota is number => nota != null);
    return {
      id: evaluacion.id,
      titulo: evaluacion.titulo,
      tipo: evaluacion.tipo as TTipoEvaluacion,
      catedra: evaluacion.catedras?.codigo ?? "Sin cátedra",
      fecha: evaluacion.fecha,
      ponderacion: evaluacion.ponderacion,
      notaMaxima: evaluacion.nota_maxima,
      promedio: notas.length > 0 ? notas.reduce((suma, nota) => suma + nota, 0) / notas.length : null,
      rendidas: notas.length,
    };
  });

  return {
    data: {
      nombre: perfil.data?.nombres ?? "docente",
      counts: {
        catedrasActivas: catedraRows.filter((catedra) => catedra.estado === "planificada" || catedra.estado === "en_curso")
          .length,
        sesionesHoy: sesionRows.filter((sesion) => sesion.fecha === hoy && sesion.estado === "programada").length,
        inscritos: inscritos.count ?? 0,
      },
      catedras: catedraRows,
      sesiones: sesionRows,
      materiales: materialRows,
      evaluaciones: evaluacionRows,
    },
    error: null,
  };
}