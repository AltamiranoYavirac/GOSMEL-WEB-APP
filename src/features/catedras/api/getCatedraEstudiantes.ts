import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ICatedraDetalleEstudiantes, ICatedraEstudianteItem, ICatedraSolicitudItem } from "../model/catedra-estudiantes.types";

export async function getCatedraEstudiantes(
  catedraId: string
): Promise<{ data: ICatedraDetalleEstudiantes | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const [catedraRes, inscripcionesRes] = await Promise.all([
    supabase
      .from("catedras")
      .select("id, codigo, cursos(nombre, precio_referencial)")
      .eq("id", catedraId)
      .single(),
    supabase
      .from("inscripciones")
      .select(`
        id,
        fecha_inscripcion,
        estado,
        estudiante_id,
        solicitada_por,
        estudiantes!inscripciones_estudiante_id_fkey(id, nombres, apellidos, cedula, email, celular),
        acuerdos_pago(id, monto_mensual, dia_cobro, estado)
      `)
      .eq("catedra_id", catedraId)
      .in("estado", ["activa", "pendiente"])
      .order("fecha_inscripcion", { ascending: false }),
  ]);

  if (catedraRes.error) {
    return { data: null, error: catedraRes.error.message };
  }

  if (inscripcionesRes.error) {
    return { data: null, error: inscripcionesRes.error.message };
  }

  const catedra = catedraRes.data;
  const precioReferencial = catedra.cursos?.precio_referencial != null ? Number(catedra.cursos.precio_referencial) : null;

  const matriculados: ICatedraEstudianteItem[] = [];
  const pendientes: ICatedraSolicitudItem[] = [];

  for (const row of inscripcionesRes.data ?? []) {
    const est = row.estudiantes;
    const estNombre = `${est?.nombres ?? ""} ${est?.apellidos ?? ""}`.trim() || "Estudiante";
    const acuerdos = (row.acuerdos_pago ?? []).filter((a) => a.estado === "vigente");
    const acuerdo = acuerdos[0];

    if (row.estado === "activa") {
      matriculados.push({
        inscripcionId: row.id,
        estudianteId: row.estudiante_id,
        estudianteNombre: estNombre,
        cedula: est?.cedula ?? null,
        email: est?.email ?? null,
        celular: est?.celular ?? null,
        fechaInscripcion: row.fecha_inscripcion,
        estado: row.estado,
        montoMensual: acuerdo ? Number(acuerdo.monto_mensual) : null,
        diaCobro: acuerdo ? acuerdo.dia_cobro : null,
        acuerdoEstado: acuerdo ? acuerdo.estado : null,
      });
    } else if (row.estado === "pendiente") {
      pendientes.push({
        inscripcionId: row.id,
        estudianteId: row.estudiante_id,
        estudianteNombre: estNombre,
        solicitadaPor: row.solicitada_por,
        fechaInscripcion: row.fecha_inscripcion,
        precioReferencial,
      });
    }
  }

  return {
    data: {
      catedraId,
      codigo: catedra.codigo,
      curso: catedra.cursos?.nombre ?? "Curso",
      precioReferencial,
      matriculados,
      pendientes,
    },
    error: null,
  };
}
