import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Database } from "@/shared/api/supabase/database.types";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import type {
  ITeacher,
  ITeacherFormacion,
  ITeacherInstrument,
  ITeacherPortafolio,
  ITeacherReconocimiento,
  ITeacherTestimonial,
  TTipoPortafolio,
} from "../model/teachers.types";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

export async function getPublicDocentes(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient()
): Promise<{
  data: ITeacher[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("docentes")
    .select(
      `
      perfil_id,
      slug,
      titulo_profesional,
      biografia,
      frase_destacada,
      anios_experiencia,
      redes_sociales,
      orden,
      publicado,
      perfiles!docentes_perfil_id_fkey (
        nombres,
        apellidos,
        avatar_public_id
      ),
      docente_instrumento (
        es_principal,
        instrumentos (
          nombre
        )
      ),
      docente_formacion (
        institucion,
        titulo,
        descripcion,
        orden
      ),
      docente_portafolio (
        tipo,
        titulo,
        url_externa,
        orden
      ),
      docente_reconocimientos (
        titulo,
        anio,
        entidad_otorgante,
        descripcion,
        orden
      )
    `
    )
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const docenteIds = (data ?? []).map((docente) => docente.perfil_id);

  const { data: testimonios, error: testimoniosError } = await supabase
    .from("testimonios")
    .select("docente_id, autor_nombre, autor_rol, cita, orden")
    .eq("publicado", true)
    .in("docente_id", docenteIds.length > 0 ? docenteIds : [EMPTY_UUID])
    .order("orden", { ascending: true });

  if (testimoniosError) {
    return { data: null, error: testimoniosError.message };
  }

  const testimoniosPorDocente = new Map<string, ITeacherTestimonial[]>();
  for (const testimonio of testimonios ?? []) {
    if (!testimonio.docente_id) continue;
    const lista = testimoniosPorDocente.get(testimonio.docente_id) ?? [];
    lista.push({
      quote: testimonio.cita,
      author: testimonio.autor_nombre,
      role: testimonio.autor_rol ?? "Alumno",
    });
    testimoniosPorDocente.set(testimonio.docente_id, lista);
  }

  const rows: ITeacher[] = (data ?? []).map((docente) => {
    const perfil = docente.perfiles;
    const nombres = perfil?.nombres?.trim() ?? "";
    const apellidos = perfil?.apellidos?.trim() ?? "";
    const name = `${nombres} ${apellidos}`.trim() || docente.slug;

    const instruments: ITeacherInstrument[] = (docente.docente_instrumento ?? [])
      .map((item) => ({
        nombre: item.instrumentos?.nombre ?? "",
        esPrincipal: item.es_principal,
      }))
      .filter((item) => item.nombre)
      .sort((a, b) => Number(b.esPrincipal) - Number(a.esPrincipal));

    const instrument = instruments[0]?.nombre ?? "";

    const formaciones: ITeacherFormacion[] = (docente.docente_formacion ?? [])
      .sort((a, b) => a.orden - b.orden)
      .map((f) => ({
        institucion: f.institucion,
        titulo: f.titulo,
        descripcion: f.descripcion,
        orden: f.orden,
      }));

    const formacionPrincipal = formaciones[0];
    const formacionTexto = formacionPrincipal
      ? `${formacionPrincipal.institucion} · ${formacionPrincipal.titulo}`
      : docente.titulo_profesional ?? null;

    const portafolio: ITeacherPortafolio[] = (docente.docente_portafolio ?? [])
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        tipo: item.tipo as TTipoPortafolio,
        titulo: item.titulo,
        urlExterna: item.url_externa,
      }));

    const reconocimientos: ITeacherReconocimiento[] = (docente.docente_reconocimientos ?? [])
      .sort((a, b) => a.orden - b.orden)
      .map((item) => ({
        titulo: item.titulo,
        anio: item.anio,
        entidadOtorgante: item.entidad_otorgante,
        descripcion: item.descripcion,
      }));

    const avatarPublicId = perfil?.avatar_public_id ?? null;
    const photo = buildCloudinaryImageUrl(
      avatarPublicId,
      "ar_1:1,c_fill,g_auto,w_800,q_auto,f_auto"
    ) ?? "";

    return {
      id: docente.perfil_id,
      perfilId: docente.perfil_id,
      slug: docente.slug,
      name,
      instrument,
      instruments,
      tituloProfesional: docente.titulo_profesional,
      biografia: docente.biografia,
      fraseDestacada: docente.frase_destacada,
      aniosExperiencia: docente.anios_experiencia,
      avatarPublicId,
      photo,
      photoAlt: photo ? `${name}, profesor de ${instrument || "música"} de GOSMEL` : "",
      formacion: formaciones,
      formacionTexto,
      orden: docente.orden,
      redesSociales: (docente.redes_sociales ?? {}) as Record<string, string>,
      portafolio,
      reconocimientos,
      tags: docente.anios_experiencia
        ? [`${docente.anios_experiencia} años de experiencia`]
        : [],
      education: formaciones.map((f) => ({
        title: f.institucion,
        detail: f.titulo,
      })),
      studentTestimonials: testimoniosPorDocente.get(docente.perfil_id) ?? [],
      headline:
        docente.titulo_profesional ??
        (instrument ? `Profesor de ${instrument}` : "Profesor de música"),
      bio: docente.biografia ?? "",
    };
  });

  return { data: rows, error: null };
}
