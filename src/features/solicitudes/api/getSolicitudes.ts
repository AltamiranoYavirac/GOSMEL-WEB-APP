import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISolicitudRow, TSolicitudEstado, TSolicitudTipo } from "../model/solicitud.types";

export async function getSolicitudes(): Promise<{
  data: ISolicitudRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("solicitudes")
    .select(
      "id, created_at, nombre_completo, email, telefono, tipo, estado, curso_id, cursos(nombre), instrumento_id, instrumentos(nombre), docente_id, docentes(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), estudiante_nombre, estudiante_fecha_nacimiento, para_menor, parentesco"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ISolicitudRow[] = (data ?? []).map((solicitud) => {
    const docente = solicitud.docentes?.perfiles;
    const interes =
      solicitud.cursos?.nombre ??
      solicitud.instrumentos?.nombre ??
      (docente ? `${docente.nombres} ${docente.apellidos}`.trim() : null);

    return {
      id: solicitud.id,
      fecha: solicitud.created_at,
      nombre: solicitud.nombre_completo ?? "Sin nombre",
      email: solicitud.email,
      telefono: solicitud.telefono,
      tipo: solicitud.tipo as TSolicitudTipo,
      estado: solicitud.estado as TSolicitudEstado,
      interes,
      estudianteNombre: solicitud.estudiante_nombre,
      estudianteFechaNacimiento: solicitud.estudiante_fecha_nacimiento,
      paraMenor: solicitud.para_menor,
      parentesco: solicitud.parentesco,
    };
  });

  return { data: rows, error: null };
}