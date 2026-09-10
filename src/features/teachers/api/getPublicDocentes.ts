import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITeacher, ITeacherFormacion } from "../model/teachers.types";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dv9lm0fnm/image/upload";

export async function getPublicDocentes(): Promise<{
  data: ITeacher[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

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
      )
    `
    )
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ITeacher[] = (data ?? []).map((docente) => {
    const perfil = docente.perfiles;
    const nombres = perfil?.nombres?.trim() ?? "";
    const apellidos = perfil?.apellidos?.trim() ?? "";
    const name = `${nombres} ${apellidos}`.trim() || docente.slug;

    const instrumentosList = docente.docente_instrumento ?? [];
    const principalItem =
      instrumentosList.find((item) => item.es_principal) ?? instrumentosList[0];
    const instrument = principalItem?.instrumentos?.nombre ?? "";

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

    const avatarPublicId = perfil?.avatar_public_id ?? null;
    const photo = avatarPublicId
      ? `${CLOUDINARY_BASE}/ar_1:1,c_fill,g_auto,w_800,q_auto,f_auto/${avatarPublicId}`
      : "";


    return {
      id: docente.perfil_id,
      perfilId: docente.perfil_id,
      slug: docente.slug,
      name,
      instrument,
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
      tags: docente.anios_experiencia
        ? [`${docente.anios_experiencia} años de experiencia`]
        : [],
      education: formaciones.map((f) => ({
        title: f.institucion,
        detail: f.titulo,
      })),
      studentTestimonials: [],
      headline:
        docente.titulo_profesional ??
        (instrument ? `Profesor de ${instrument}` : "Profesor de música"),
      bio: docente.biografia ?? "",
    };

  });

  return { data: rows, error: null };
}
