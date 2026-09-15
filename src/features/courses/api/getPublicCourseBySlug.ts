import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import type {
  IPublicCourseDetail,
  IPublicCourseTeacher,
  TPublicCourseCategory,
} from "../model/course-public.types";

const CATEGORY_LABELS: Record<TPublicCourseCategory, string> = {
  instrumento: "Instrumento",
  lenguaje_musical: "Lenguaje musical",
  otro: "Formación musical",
};

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const getPublicCourseBySlug = cache(async (slug: string): Promise<{
  data: IPublicCourseDetail | null;
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("cursos")
    .select("id, slug, nombre, resumen, descripcion, categoria, portada_public_id, portada_texto_alt, etiqueta_precio, mostrar_precio, publico_edad, publico_nivel, formato_clase, horario_resumen, cierre_etapa, cta_titulo, cta_descripcion, cta_primario_texto, cta_secundario_texto, orden, puntuacion_promedio, total_resenas, instrumentos(icono), curso_habilidades(habilidad, orden), curso_modulos(id, titulo, descripcion, orden, curso_lecciones(id, titulo, orden)), catedras(docente_id, catedra_horarios(dia_semana, hora_inicio, hora_fin), docentes!catedras_docente_id_fkey(slug, titulo_profesional, perfiles!docentes_perfil_id_fkey(nombres, apellidos, avatar_public_id))), galeria_medios(id, public_id, texto_alt, orden), testimonios(autor_nombre, autor_rol, cita, orden)")
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  const teachers = new Map<string, IPublicCourseTeacher>();
  const schedules = new Set<string>();
  for (const catedra of data.catedras ?? []) {
    const docente = catedra.docentes;
    const perfil = docente?.perfiles;
    if (docente && perfil && !teachers.has(catedra.docente_id)) {
      const name = `${perfil.nombres} ${perfil.apellidos}`.trim();
      teachers.set(catedra.docente_id, {
        id: catedra.docente_id,
        slug: docente.slug,
        name,
        headline: docente.titulo_profesional ?? "Docente de música",
        photo: buildCloudinaryImageUrl(perfil.avatar_public_id, "ar_1:1,c_fill,g_auto,w_500,q_auto,f_auto"),
        photoAlt: name ? `${name}, docente de GOSMEL` : "Docente de GOSMEL",
      });
    }
    for (const horario of catedra.catedra_horarios ?? []) {
      schedules.add(`${DAY_LABELS[horario.dia_semana] ?? "Día"} ${horario.hora_inicio.slice(0, 5)}–${horario.hora_fin.slice(0, 5)}`);
    }
  }

  const testimonial = (data.testimonios ?? []).slice().sort((a, b) => a.orden - b.orden)[0];

  return {
    data: {
      id: data.id,
      slug: data.slug,
      title: data.nombre,
      category: CATEGORY_LABELS[data.categoria],
      categoryValue: data.categoria,
      icon: data.instrumentos?.icono ?? "ph:music-notes",
      description: data.descripcion,
      learns: (data.curso_habilidades ?? []).slice().sort((a, b) => a.orden - b.orden).map((item) => item.habilidad),
      modules: (data.curso_modulos ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((modulo) => ({
          id: modulo.id,
          title: modulo.titulo,
          description: modulo.descripcion,
          lessons: (modulo.curso_lecciones ?? [])
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((leccion) => ({ id: leccion.id, title: leccion.titulo })),
        })),
      image: buildCloudinaryImageUrl(data.portada_public_id, "q_auto,f_auto,w_1200"),
      imageAlt: data.portada_texto_alt ?? `Portada del curso ${data.nombre}`,
      priceLabel: data.mostrar_precio ? data.etiqueta_precio : null,
      rating: data.puntuacion_promedio,
      totalReviews: data.total_resenas,
      teachers: Array.from(teachers.values()),
      audienceAge: data.publico_edad ?? "",
      audienceLevel: data.publico_nivel ?? "",
      classFormat: data.formato_clase ?? "",
      schedule: data.horario_resumen || Array.from(schedules).join(" · "),
      stageClosing: data.cierre_etapa ?? "",
      gallery: (data.galeria_medios ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((item) => ({
          id: item.id,
          src: buildCloudinaryImageUrl(item.public_id, "q_auto,f_auto,w_1400") ?? "",
          alt: item.texto_alt,
        }))
        .filter((item) => Boolean(item.src)),
      testimonial: testimonial
        ? {
            quote: testimonial.cita,
            author: testimonial.autor_nombre,
            role: testimonial.autor_rol ?? `Estudiante de ${data.nombre}`,
          }
        : null,
      ctaTitle: data.cta_titulo ?? "",
      ctaDescription: data.cta_descripcion ?? "",
      ctaPrimaryText: data.cta_primario_texto ?? "Reservar clase de prueba",
      ctaSecondaryText: data.cta_secundario_texto ?? "Ver otros cursos",
    },
    error: null,
  };
});
