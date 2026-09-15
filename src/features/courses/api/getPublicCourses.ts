import { createSupabasePublicClient } from "@/shared/api/supabase/public";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import type {
  IPublicCourseCard,
  IPublicCourseTeacher,
  TPublicCourseCategory,
} from "../model/course-public.types";

const CATEGORY_LABELS: Record<TPublicCourseCategory, string> = {
  instrumento: "Instrumento",
  lenguaje_musical: "Lenguaje musical",
  otro: "Formación musical",
};

export async function getPublicCourses(): Promise<{
  data: IPublicCourseCard[] | null;
  error: string | null;
}> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("cursos")
    .select("id, slug, nombre, resumen, descripcion, categoria, portada_public_id, portada_texto_alt, etiqueta_precio, mostrar_precio, orden, puntuacion_promedio, total_resenas, instrumentos(icono), curso_habilidades(habilidad, orden), catedras(docente_id, docentes!catedras_docente_id_fkey(slug, titulo_profesional, perfiles!docentes_perfil_id_fkey(nombres, apellidos, avatar_public_id)))")
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };

  return {
    data: (data ?? []).map((course) => {
      const teachers = new Map<string, IPublicCourseTeacher>();
      for (const catedra of course.catedras ?? []) {
        const docente = catedra.docentes;
        const perfil = docente?.perfiles;
        if (!docente || !perfil || teachers.has(catedra.docente_id)) continue;
        const name = `${perfil.nombres} ${perfil.apellidos}`.trim();
        teachers.set(catedra.docente_id, {
          id: catedra.docente_id,
          slug: docente.slug,
          name,
          headline: docente.titulo_profesional ?? "Docente de música",
          photo: buildCloudinaryImageUrl(perfil.avatar_public_id, "ar_1:1,c_fill,g_auto,w_240,q_auto,f_auto"),
          photoAlt: name ? `${name}, docente de GOSMEL` : "Docente de GOSMEL",
        });
      }

      return {
        id: course.id,
        slug: course.slug,
        title: course.nombre,
        category: CATEGORY_LABELS[course.categoria],
        categoryValue: course.categoria,
        icon: course.instrumentos?.icono ?? "ph:music-notes",
        description: course.resumen ?? course.descripcion,
        learns: (course.curso_habilidades ?? [])
          .slice()
          .sort((a, b) => a.orden - b.orden)
          .map((item) => item.habilidad),
        image: buildCloudinaryImageUrl(course.portada_public_id, "ar_4:3,c_fill,g_auto,w_1200,q_auto,f_auto"),
        imageAlt: course.portada_texto_alt ?? `Portada del curso ${course.nombre}`,
        priceLabel: course.mostrar_precio ? course.etiqueta_precio : null,
        rating: course.puntuacion_promedio,
        totalReviews: course.total_resenas,
        teachers: Array.from(teachers.values()),
      };
    }),
    error: null,
  };
}
