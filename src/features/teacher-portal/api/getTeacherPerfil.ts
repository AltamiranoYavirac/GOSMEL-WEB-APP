import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type {
  ITeacherFormacionItem,
  ITeacherInstrumentoItem,
  ITeacherPerfil,
  ITeacherPortafolioItem,
  ITeacherReconocimientoItem,
  TTipoPortafolio,
} from "../model/teacher-dashboard.types";

export async function getTeacherPerfil(): Promise<{
  data: ITeacherPerfil | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const [perfilDocenteRes, formacionRes, reconocimientosRes, portafolioRes, instrumentosRes] =
    await Promise.all([
      supabase
        .from("docentes")
        .select(
          "perfil_id, titulo_profesional, biografia, frase_destacada, anios_experiencia, redes_sociales, perfiles!docentes_perfil_id_fkey(nombres, apellidos, email)"
        )
        .eq("perfil_id", user.id)
        .maybeSingle(),
      supabase
        .from("docente_formacion")
        .select("id, institucion, titulo, anio_inicio, anio_fin, descripcion, orden")
        .eq("docente_id", user.id)
        .order("orden", { ascending: true })
        .order("anio_inicio", { ascending: false }),
      supabase
        .from("docente_reconocimientos")
        .select("id, titulo, anio, entidad_otorgante, descripcion, orden")
        .eq("docente_id", user.id)
        .order("orden", { ascending: true })
        .order("anio", { ascending: false }),
      supabase
        .from("docente_portafolio")
        .select("id, tipo, titulo, url_externa, orden")
        .eq("docente_id", user.id)
        .order("orden", { ascending: true }),
      supabase
        .from("docente_instrumento")
        .select("instrumento_id, es_principal, instrumentos(nombre)")
        .eq("docente_id", user.id),
    ]);

  if (perfilDocenteRes.error) {
    return { data: null, error: perfilDocenteRes.error.message };
  }

  let nombre = "Docente";
  let email: string | null = null;
  let titulo: string | null = null;
  let biografia: string | null = null;
  let frase: string | null = null;
  let anios: number | null = 0;
  let redes: Record<string, string> = {};

  if (perfilDocenteRes.data) {
    const doc = perfilDocenteRes.data;
    nombre = `${doc.perfiles?.nombres ?? ""} ${doc.perfiles?.apellidos ?? ""}`.trim() || "Docente";
    email = doc.perfiles?.email ?? null;
    titulo = doc.titulo_profesional;
    biografia = doc.biografia;
    frase = doc.frase_destacada;
    anios = doc.anios_experiencia;
    redes = (doc.redes_sociales as Record<string, string>) ?? {};
  } else {
    const { data: usuarioPerfil } = await supabase
      .from("perfiles")
      .select("nombres, apellidos, email")
      .eq("id", user.id)
      .maybeSingle();

    if (usuarioPerfil) {
      nombre = `${usuarioPerfil.nombres} ${usuarioPerfil.apellidos}`.trim() || "Docente";
      email = usuarioPerfil.email;
    }
  }

  const formacion: ITeacherFormacionItem[] = (formacionRes.data ?? []).map((f) => ({
    id: f.id,
    institucion: f.institucion,
    titulo: f.titulo,
    anioInicio: f.anio_inicio,
    anioFin: f.anio_fin,
    descripcion: f.descripcion,
    orden: f.orden,
  }));

  const reconocimientos: ITeacherReconocimientoItem[] = (reconocimientosRes.data ?? []).map((r) => ({
    id: r.id,
    titulo: r.titulo,
    anio: r.anio,
    entidadOtorgante: r.entidad_otorgante,
    descripcion: r.descripcion,
    orden: r.orden,
  }));

  const portafolio: ITeacherPortafolioItem[] = (portafolioRes.data ?? []).map((p) => ({
    id: p.id,
    tipo: p.tipo as TTipoPortafolio,
    titulo: p.titulo ?? "Sin título",
    urlExterna: p.url_externa,
    orden: p.orden,
  }));

  const instrumentos: ITeacherInstrumentoItem[] = (instrumentosRes.data ?? []).map((inst) => ({
    instrumentoId: inst.instrumento_id,
    nombre: inst.instrumentos?.nombre ?? "Instrumento",
    esPrincipal: inst.es_principal,
  }));

  return {
    data: {
      id: user.id,
      nombre,
      email,
      tituloProfesional: titulo,
      biografia,
      fraseDestacada: frase,
      aniosExperiencia: anios,
      redesSociales: redes,
      formacion,
      reconocimientos,
      portafolio,
      instrumentos,
    },
    error: null,
  };
}
