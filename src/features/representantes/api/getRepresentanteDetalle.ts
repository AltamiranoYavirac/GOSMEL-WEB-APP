import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { IRepresentanteDetalle, IRepresentadoEstudiante } from "../model/representante.types";

export async function getRepresentanteDetalle(representanteId: string): Promise<{
  data: IRepresentanteDetalle | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rep, error: repError } = await supabase
    .from("representantes")
    .select(`
      id,
      nombres,
      apellidos,
      cedula,
      celular,
      email,
      direccion,
      ocupacion,
      perfil_id,
      estudiante_representante (
        parentesco,
        es_contacto_principal,
        autoriza_retiro,
        estudiantes (
          id,
          nombres,
          apellidos,
          cedula,
          fecha_nacimiento,
          inscripciones (
            id,
            estado,
            catedras (
              codigo,
              cursos (
                nombre
              )
            )
          )
        )
      )
    `)
    .eq("id", representanteId)
    .single();

  if (repError || !rep) {
    return { data: null, error: repError?.message ?? "Representante no encontrado" };
  }

  const { data: estadoCuenta } = await supabase
    .from("v_estado_cuenta")
    .select("estudiante_id, saldo")
    .eq("estado_efectivo", "vencida");

  const deudasMap = new Map<string, number>();
  (estadoCuenta ?? []).forEach((row) => {
    if (row.estudiante_id) {
      const actual = deudasMap.get(row.estudiante_id) ?? 0;
      deudasMap.set(row.estudiante_id, actual + (Number(row.saldo) || 0));
    }
  });

  const now = new Date();
  let totalSaldo = 0;

  const representados: IRepresentadoEstudiante[] = (rep.estudiante_representante ?? []).flatMap((er) => {
    const est = er.estudiantes;
    if (!est) return [];

    const birthDate = new Date(est.fecha_nacimiento);
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }

    const inscripcionActiva = est.inscripciones?.find((i) => i.estado === "activa");
    const catedraNombre = inscripcionActiva?.catedras?.cursos?.nombre
      ? `${inscripcionActiva.catedras.cursos.nombre} (${inscripcionActiva.catedras.codigo})`
      : null;

    const saldo = deudasMap.get(est.id) ?? 0;
    totalSaldo += saldo;

    return [{
      id: est.id,
      nombre: `${est.nombres} ${est.apellidos}`.trim(),
      cedula: est.cedula,
      fecha_nacimiento: est.fecha_nacimiento,
      edad: age,
      parentesco: er.parentesco,
      es_contacto_principal: er.es_contacto_principal,
      autoriza_retiro: er.autoriza_retiro,
      catedra_nombre: catedraNombre,
      saldo_pendiente: saldo,
    }];
  });

  const detalle: IRepresentanteDetalle = {
    id: rep.id,
    nombres: rep.nombres,
    apellidos: rep.apellidos,
    nombre: `${rep.nombres ?? ""} ${rep.apellidos ?? ""}`.trim(),
    cedula: rep.cedula,
    celular: rep.celular,
    email: rep.email,
    direccion: rep.direccion,
    ocupacion: rep.ocupacion,
    perfil_id: rep.perfil_id,
    hijos: representados.length,
    representados,
    total_saldo_familiar: totalSaldo,
  };

  return { data: detalle, error: null };
}
