import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  IDocenteCatedra,
  IDocenteDetalle,
  TEstadoCatedra,
  TModalidadCurso,
  TTipoPortafolio,
} from "../model/docente-detalle.types";

export async function getDocenteDetalle(
  docenteId: string
): Promise<{ data: IDocenteDetalle | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const [docente, formacion, reconocimientos, portafolio, catedras] = await Promise.all([
    supabase
      .from("docentes")
      .select(
        "perfil_id, titulo_profesional, biografia, anios_experiencia, destacado, publicado, perfiles!docentes_perfil_id_fkey(nombres, apellidos, email), docente_instrumento(instrumentos(nombre))"
      )
      .eq("perfil_id", docenteId)
      .maybeSingle(),
    supabase
      .from("docente_formacion")
      .select("id, institucion, titulo, anio_inicio, anio_fin, descripcion")
      .eq("docente_id", docenteId)
      .order("orden", { ascending: true })
      .limit(50),
    supabase
      .from("docente_reconocimientos")
      .select("id, titulo, anio, entidad_otorgante, descripcion")
      .eq("docente_id", docenteId)
      .order("orden", { ascending: true })
      .limit(50),
    supabase
      .from("docente_portafolio")
      .select("id, tipo, titulo, url_externa")
      .eq("docente_id", docenteId)
      .order("orden", { ascending: true })
      .limit(50),
    supabase
      .from("catedras")
      .select("id, codigo, modalidad, estado, cursos(nombre)")
      .eq("docente_id", docenteId)
      .order("codigo", { ascending: true })
      .limit(100),
  ]);

  const firstError = [docente, formacion, reconocimientos, portafolio, catedras]
    .map((result) => result.error)
    .find(Boolean);
  if (firstError) {
    return { data: null, error: firstError.message };
  }

  if (!docente.data) {
    return { data: null, error: null };
  }

  const catedraRows: IDocenteCatedra[] = (catedras.data ?? []).map((catedra) => ({
    id: catedra.id,
    codigo: catedra.codigo,
    curso: catedra.cursos?.nombre ?? "Sin curso",
    modalidad: catedra.modalidad as TModalidadCurso,
    estado: catedra.estado as TEstadoCatedra,
  }));

  return {
    data: {
      id: docente.data.perfil_id,
      nombre: `${docente.data.perfiles?.nombres ?? ""} ${docente.data.perfiles?.apellidos ?? ""}`.trim(),
      email: docente.data.perfiles?.email ?? null,
      titulo: docente.data.titulo_profesional,
      biografia: docente.data.biografia,
      aniosExperiencia: docente.data.anios_experiencia,
      destacado: docente.data.destacado,
      publicado: docente.data.publicado,
      instrumentos: (docente.data.docente_instrumento ?? [])
        .map((item) => item.instrumentos?.nombre ?? "")
        .filter(Boolean),
      formacion: (formacion.data ?? []).map((item) => ({
        id: item.id,
        institucion: item.institucion,
        titulo: item.titulo,
        anioInicio: item.anio_inicio,
        anioFin: item.anio_fin,
        descripcion: item.descripcion,
      })),
      reconocimientos: (reconocimientos.data ?? []).map((item) => ({
        id: item.id,
        titulo: item.titulo,
        anio: item.anio,
        entidadOtorgante: item.entidad_otorgante,
        descripcion: item.descripcion,
      })),
      portafolio: (portafolio.data ?? []).map((item) => ({
        id: item.id,
        tipo: item.tipo as TTipoPortafolio,
        titulo: item.titulo,
        urlExterna: item.url_externa,
      })),
      catedras: catedraRows,
    },
    error: null,
  };
}