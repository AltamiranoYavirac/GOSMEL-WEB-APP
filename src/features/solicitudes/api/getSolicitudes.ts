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
      "id, created_at, nombre_completo, email, telefono, tipo, estado, mensaje, origen_url, curso_id, cursos(nombre), instrumento_id, instrumentos(nombre), docente_id, docentes(perfiles!docentes_perfil_id_fkey(nombres, apellidos)), estudiante_nombre, estudiante_fecha_nacimiento, para_menor, parentesco, consentimiento_datos, consentimiento_en, consentimiento_otorgado_por, notas_internas, responsable:perfiles!solicitudes_atendida_por_fkey(nombres, apellidos, avatar_public_id)"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ISolicitudRow[] = (data ?? []).map((solicitud) => {
    const docente = solicitud.docentes?.perfiles;
    const responsable = solicitud.responsable;
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
      mensaje: solicitud.mensaje,
      origenUrl: solicitud.origen_url,
      interes,
      estudianteNombre: solicitud.estudiante_nombre,
      estudianteFechaNacimiento: solicitud.estudiante_fecha_nacimiento,
      paraMenor: solicitud.para_menor,
      parentesco: solicitud.parentesco,
      consentimientoDatos: solicitud.consentimiento_datos,
      consentimientoEn: solicitud.consentimiento_en,
      consentimientoOtorgadoPor: solicitud.consentimiento_otorgado_por,
      notasInternas: solicitud.notas_internas,
      responsableNombre: responsable
        ? `${responsable.nombres} ${responsable.apellidos}`.trim()
        : null,
      responsableAvatarPublicId: responsable?.avatar_public_id ?? null,
    };
  });

  return { data: rows, error: null };
}