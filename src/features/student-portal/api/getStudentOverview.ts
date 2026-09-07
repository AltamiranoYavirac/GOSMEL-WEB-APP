import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IStudentOverview, IStudentProximaClase, TModalidadCurso } from "../model/student-dashboard.types";

function startOfWeek(): string {
  const ahora = new Date();
  const dia = ahora.getDay() === 0 ? 7 : ahora.getDay();
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() - (dia - 1));
  return lunes.toISOString().slice(0, 10);
}

export async function getStudentOverview(estudianteId: string): Promise<{
  data: IStudentOverview | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: inscripciones, error: inscError } = await supabase
    .from("inscripciones")
    .select("catedra_id")
    .eq("estudiante_id", estudianteId)
    .eq("estado", "activa");

  if (inscError) {
    return { data: null, error: inscError.message };
  }

  const catedraIds = (inscripciones ?? []).map((item) => item.catedra_id).filter((id): id is string => Boolean(id));
  const hoy = new Date().toISOString().slice(0, 10);

  const [promedio, estadoCuenta, practica, actividades, proximaClase] = await Promise.all([
    supabase
      .from("v_promedio_academico")
      .select("promedio_sobre_10, evaluaciones_rendidas")
      .eq("estudiante_id", estudianteId),
    supabase
      .from("v_estado_cuenta")
      .select("estado_efectivo, saldo, monto, monto_pagado, cuota_id")
      .eq("estudiante_id", estudianteId),
    supabase
      .from("registros_practica")
      .select("minutos")
      .eq("estudiante_id", estudianteId)
      .gte("fecha", startOfWeek()),
    supabase
      .from("actividades")
      .select("id, tipo, titulo, descripcion, created_at")
      .eq("estudiante_id", estudianteId)
      .order("created_at", { ascending: false })
      .limit(8),
    catedraIds.length > 0
      ? supabase
          .from("sesiones")
          .select(
            "id, fecha, hora_inicio, hora_fin, tema, catedras!sesiones_catedra_id_fkey(codigo, aula, modalidad, cursos(nombre), docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)))"
          )
          .in("catedra_id", catedraIds)
          .eq("estado", "programada")
          .gte("fecha", hoy)
          .order("fecha", { ascending: true })
          .limit(1)
      : Promise.resolve({ data: null, error: null }),
  ]);

  const firstError = [promedio, estadoCuenta, practica, actividades, proximaClase]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const rowsPromedio = promedio.data ?? [];
  const promedioSobre10 =
    rowsPromedio.length > 0
      ? rowsPromedio.reduce((acc, row) => acc + (Number(row.promedio_sobre_10) || 0), 0) / rowsPromedio.length
      : null;
  const evaluacionesRendidas = rowsPromedio.reduce((acc, row) => acc + (row.evaluaciones_rendidas ?? 0), 0);

  const cuentas = estadoCuenta.data ?? [];
  const vencidas = cuentas.filter((row) => row.estado_efectivo === "vencida").length;
  const pendientes = cuentas.filter((row) => ["pendiente", "parcial", "vencida"].includes(row.estado_efectivo ?? ""));
  const saldoPendiente = pendientes.reduce((acc, row) => acc + (Number(row.saldo) || 0), 0);

  let estadoPagos: IStudentOverview["estadoPagos"] = "al_dia";
  if (vencidas > 0) {
    estadoPagos = "cuota_vencida";
  } else if (pendientes.length > 0) {
    estadoPagos = "por_vencer";
  }

  const practicaSemanalMinutos = (practica.data ?? []).reduce((acc, row) => acc + (row.minutos ?? 0), 0);

  const sesion = proximaClase.data?.[0];
  const catedra = sesion?.catedras;
  const docente = catedra?.docentes?.perfiles;
  let proximaClaseRow: IStudentProximaClase | null = null;
  if (sesion && catedra) {
    proximaClaseRow = {
      sesionId: sesion.id,
      fecha: sesion.fecha,
      horaInicio: sesion.hora_inicio,
      horaFin: sesion.hora_fin,
      tema: sesion.tema,
      catedra: catedra.codigo,
      curso: catedra.cursos?.nombre ?? "Curso",
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
      aula: catedra.aula,
      modalidad: catedra.modalidad as TModalidadCurso,
    };
  }

  return {
    data: {
      proximaClase: proximaClaseRow,
      promedioSobre10,
      evaluacionesRendidas,
      practicaSemanalMinutos,
      estadoPagos,
      saldoPendiente,
      cuotasVencidas: vencidas,
      actividades: (actividades.data ?? []).map((item) => ({
        id: item.id,
        tipo: item.tipo,
        titulo: item.titulo,
        descripcion: item.descripcion,
        creadaEn: item.created_at,
      })),
    },
    error: null,
  };
}