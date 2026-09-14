import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { TEstadoCatedra } from "@/entities/catedra";

import type { IAsignacionDocente, IAsignacionRow, IAsignacionesData } from "../model/asignacion.types";

export async function getAsignaciones(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IAsignacionesData | null;
  error: string | null;
}> {

  const { data: rolesDocente } = await supabase
    .from("perfil_rol")
    .select("perfil_id, rol")
    .in("rol", ["docente", "admin"]);

  const docentePerfilIds = Array.from(new Set((rolesDocente ?? []).map((rol) => rol.perfil_id)));
  const fallbackIds = docentePerfilIds.length > 0 ? docentePerfilIds : ["00000000-0000-0000-0000-000000000000"];

  const [catedras, perfilesDocentes, docenteInstrumentos, sesiones] = await Promise.all([
    supabase
      .from("catedras")
      .select(
        "id, codigo, estado, docente_id, cursos(nombre, instrumento_id, instrumentos(nombre)), docentes!catedras_docente_id_fkey(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), inscripciones!inscripciones_catedra_id_fkey(estado)"
      )
      .order("codigo", { ascending: true })
      .limit(300),
    supabase
      .from("perfiles")
      .select("id, nombres, apellidos")
      .in("id", fallbackIds)
      .order("nombres", { ascending: true })
      .limit(300),
    supabase
      .from("docente_instrumento")
      .select("docente_id, instrumento_id")
      .in("docente_id", fallbackIds)
      .limit(1000),
    supabase.from("sesiones").select("catedra_id").limit(5000),
  ]);

  const firstError = [catedras, perfilesDocentes, docenteInstrumentos, sesiones]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const instrumentosPorDocente = new Map<string, string[]>();
  for (const item of docenteInstrumentos.data ?? []) {
    const lista = instrumentosPorDocente.get(item.docente_id) ?? [];
    lista.push(item.instrumento_id);
    instrumentosPorDocente.set(item.docente_id, lista);
  }

  const sesionesPorCatedra = new Map<string, number>();
  for (const sesion of sesiones.data ?? []) {
    sesionesPorCatedra.set(sesion.catedra_id, (sesionesPorCatedra.get(sesion.catedra_id) ?? 0) + 1);
  }

  const docentes: IAsignacionDocente[] = (perfilesDocentes.data ?? []).map((perfil) => ({
    id: perfil.id,
    nombre: `${perfil.nombres} ${perfil.apellidos}`.trim(),
    instrumentoIds: instrumentosPorDocente.get(perfil.id) ?? [],
  }));

  const rows: IAsignacionRow[] = (catedras.data ?? []).map((catedra) => {
    const docente = catedra.docentes?.perfiles;
    const inscripciones = catedra.inscripciones ?? [];

    return {
      catedraId: catedra.id,
      codigo: catedra.codigo,
      curso: catedra.cursos?.nombre ?? "Sin curso",
      instrumentoId: catedra.cursos?.instrumento_id ?? null,
      instrumento: catedra.cursos?.instrumentos?.nombre ?? null,
      docenteId: catedra.docente_id,
      docente: docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null,
      estudiantesActivos: inscripciones.filter((inscripcion) => inscripcion.estado === "activa").length,
      sesiones: sesionesPorCatedra.get(catedra.id) ?? 0,
      estado: catedra.estado as TEstadoCatedra,
    };
  });

  return { data: { catedras: rows, docentes }, error: null };
}
