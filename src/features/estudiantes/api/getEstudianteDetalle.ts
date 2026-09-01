import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  ICuotaDetalle,
  IEstudianteDetalle,
  IInscripcionDetalle,
  TEstadoCuota,
  TEstadoInscripcion,
} from "../model/estudiante-detalle.types";

export async function getEstudianteDetalle(
  estudianteId: string
): Promise<{ data: IEstudianteDetalle | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const [estudiante, inscripciones, acuerdos] = await Promise.all([
    supabase
      .from("estudiantes")
      .select(
        "id, nombres, apellidos, email, cedula, celular, fecha_nacimiento, activo, estudiante_instrumento(instrumentos(nombre)), estudiante_representante(representantes(nombres, apellidos), es_contacto_principal)"
      )
      .eq("id", estudianteId)
      .maybeSingle(),
    supabase
      .from("inscripciones")
      .select(`
        id,
        estado,
        catedra_id,
        catedras!inscripciones_catedra_id_fkey(
          codigo,
          cursos(nombre),
          docentes(
            perfiles(nombres, apellidos)
          )
        )
      `)
      .eq("estudiante_id", estudianteId)
      .order("fecha_inscripcion", { ascending: false })
      .limit(50),
    supabase
      .from("acuerdos_pago")
      .select(
        "id, cuotas!cuotas_acuerdo_id_fkey(id, periodo_mes, monto, monto_pagado, fecha_vencimiento, estado)"
      )
      .eq("estudiante_id", estudianteId),
  ]);

  const firstError = [estudiante, inscripciones, acuerdos].map((result) => result.error).find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  if (!estudiante.data) {
    return { data: null, error: null };
  }

  const representantePrincipal = estudiante.data.estudiante_representante?.find(
    (vinculo) => vinculo.es_contacto_principal || vinculo.representantes
  )?.representantes;

  const inscripcionRows: IInscripcionDetalle[] = (inscripciones.data ?? []).map((inscripcion) => {
    const cat = inscripcion.catedras;
    const docPerfil = cat?.docentes?.perfiles;
    const docenteNombre = docPerfil
      ? `${docPerfil.nombres} ${docPerfil.apellidos}`.trim()
      : null;

    return {
      id: inscripcion.id,
      catedra: cat?.codigo ?? "Sin cátedra",
      curso: cat?.cursos?.nombre ?? "—",
      docenteNombre,
      estado: inscripcion.estado as TEstadoInscripcion,
    };
  });

  const cuotaRows: ICuotaDetalle[] = (acuerdos.data ?? [])
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

  return {
    data: {
      id: estudiante.data.id,
      nombre: `${estudiante.data.nombres} ${estudiante.data.apellidos}`.trim(),
      email: estudiante.data.email,
      cedula: estudiante.data.cedula,
      celular: estudiante.data.celular,
      fechaNacimiento: estudiante.data.fecha_nacimiento,
      activo: estudiante.data.activo,
      instrumentos: (estudiante.data.estudiante_instrumento ?? [])
        .map((item) => item.instrumentos?.nombre ?? "")
        .filter(Boolean),
      representante: representantePrincipal
        ? `${representantePrincipal.nombres} ${representantePrincipal.apellidos}`.trim()
        : null,
      inscripciones: inscripcionRows,
      cuotas: cuotaRows,
    },
    error: null,
  };
}