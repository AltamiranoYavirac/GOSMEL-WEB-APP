import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  IStudentCuota,
  IStudentData,
  IStudentDashboard,
  IStudentInscripcion,
  IStudentMaterial,
  TEstadoCuota,
  TEstadoInscripcion,
  TTipoMaterial,
} from "../model/student-dashboard.types";

export async function getStudentDashboard(): Promise<{
  data: IStudentDashboard | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const [perfil, miEstudiante, miRepresentante] = await Promise.all([
    supabase.from("perfiles").select("nombres").eq("id", user.id).maybeSingle(),
    supabase
      .from("estudiantes")
      .select("id, nombres, apellidos")
      .eq("perfil_id", user.id)
      .maybeSingle(),
    supabase.from("representantes").select("id").eq("perfil_id", user.id).maybeSingle(),
  ]);

  const estudiantesBase: { id: string; nombre: string }[] = [];

  if (miEstudiante.data) {
    estudiantesBase.push({
      id: miEstudiante.data.id,
      nombre: `${miEstudiante.data.nombres} ${miEstudiante.data.apellidos}`.trim(),
    });
  } else if (miRepresentante.data) {
    const { data: vinculos } = await supabase
      .from("estudiante_representante")
      .select("estudiante_id, estudiantes!estudiante_representante_estudiante_id_fkey(id, nombres, apellidos)")
      .eq("representante_id", miRepresentante.data.id);
    for (const vinculo of vinculos ?? []) {
      const estudiante = vinculo.estudiantes;
      if (estudiante) {
        estudiantesBase.push({
          id: estudiante.id,
          nombre: `${estudiante.nombres} ${estudiante.apellidos}`.trim(),
        });
      }
    }
  }

  const estudiantesIds = estudiantesBase.map((estudiante) => estudiante.id);

  const [inscripcionesPorEstudiante, cuotasPorEstudiante, materiales] = await Promise.all([
    Promise.all(
      estudiantesIds.map((estudianteId) =>
        supabase
          .from("inscripciones")
          .select(
            "id, estado, catedra_id, catedras!inscripciones_catedra_id_fkey(codigo, cursos(nombre), catedra_horarios(dia_semana, hora_inicio, hora_fin))"
          )
          .eq("estudiante_id", estudianteId)
      )
    ),
    Promise.all(
      estudiantesIds.map((estudianteId) =>
        supabase
          .from("acuerdos_pago")
          .select(
            "estudiante_id, cuotas!cuotas_acuerdo_id_fkey(id, periodo_mes, monto, monto_pagado, fecha_vencimiento, estado)"
          )
          .eq("estudiante_id", estudianteId)
      )
    ),
    supabase
      .from("materiales")
      .select("id, titulo, tipo, visible_para, curso_id, catedra_id, cursos(nombre)")
      .in("visible_para", ["publico", "registrados", "inscritos"])
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const firstError = [perfil, miEstudiante, miRepresentante, ...inscripcionesPorEstudiante, ...cuotasPorEstudiante, materiales]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const hoy = new Date().toISOString().slice(0, 10);

  const estudiantes: IStudentData[] = estudiantesBase.map((estudiante, index) => {
    const inscripciones: IStudentInscripcion[] = (inscripcionesPorEstudiante[index]?.data ?? []).map(
      (inscripcion) => ({
        id: inscripcion.id,
        catedra: inscripcion.catedras?.codigo ?? "Sin cátedra",
        curso: inscripcion.catedras?.cursos?.nombre ?? "—",
        estado: inscripcion.estado as TEstadoInscripcion,
        horarios: (inscripcion.catedras?.catedra_horarios ?? []).map((horario) => ({
          dia: horario.dia_semana,
          inicio: horario.hora_inicio,
          fin: horario.hora_fin,
        })),
      })
    );

    const cuotas: IStudentCuota[] = (cuotasPorEstudiante[index]?.data ?? [])
      .flatMap((acuerdo) => acuerdo.cuotas ?? [])
      .map((cuota) => ({
        id: cuota.id,
        periodo: cuota.periodo_mes,
        monto: cuota.monto,
        montoPagado: cuota.monto_pagado,
        saldo: cuota.monto - cuota.monto_pagado,
        fechaVencimiento: cuota.fecha_vencimiento,
        estado: cuota.estado as TEstadoCuota,
      }))
      .sort((a, b) => b.periodo.localeCompare(a.periodo));

    return { ...estudiante, inscripciones, cuotas };
  });

  const materialRows: IStudentMaterial[] = (materiales.data ?? []).map((material) => ({
    id: material.id,
    titulo: material.titulo,
    tipo: material.tipo as TTipoMaterial,
    destino: material.cursos?.nombre ?? "General",
  }));

  let inscripcionesActivas = 0;
  let saldoTotal = 0;
  let cuotasVencidas = 0;

  for (const estudiante of estudiantes) {
    inscripcionesActivas += estudiante.inscripciones.filter((item) => item.estado === "activa").length;
    for (const cuota of estudiante.cuotas) {
      if (cuota.estado === "pendiente" || cuota.estado === "parcial") {
        saldoTotal += cuota.saldo;
        if (cuota.fechaVencimiento && cuota.fechaVencimiento < hoy) {
          cuotasVencidas += 1;
        }
      }
    }
  }

  return {
    data: {
      nombre: perfil.data?.nombres ?? "estudiante",
      estudiantes,
      materiales: materialRows,
      counts: { inscripcionesActivas, saldoTotal, cuotasVencidas },
    },
    error: null,
  };
}