import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { AppImages } from "@/shared/config";

import { COURSES } from "../model/courses.constants";
import type { IPublicCourse } from "../model/public-course.types";

const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/dv9lm0fnm/image/upload";

function cursoImage(publicId: string | null): string {
  if (!publicId) return AppImages.HERO_COVER;
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) return publicId;
  return `${CLOUDINARY_IMAGE_BASE}/q_auto,f_auto,w_1200/${publicId}`;
}

const STATIC_FALLBACK: IPublicCourse[] = COURSES.map((course) => ({
  id: course.title,
  titulo: course.title,
  categoria: course.category,
  icono: course.icon,
  imagen: course.image,
  imagenAlt: course.imageAlt,
  descripcion: course.description,
  aprende: [...course.learns],
}));

export async function getPublicCourses(): Promise<{
  data: IPublicCourse[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cursos")
    .select(
      "id, nombre, descripcion, resumen, portada_public_id, instrumento_id, instrumentos(nombre, icono), curso_habilidades(habilidad, orden)"
    )
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IPublicCourse[] = (data ?? []).map((curso) => ({
    id: curso.id,
    titulo: curso.nombre,
    categoria: curso.instrumentos?.nombre ?? "Lenguaje musical",
    icono: curso.instrumentos?.icono ?? "ph:music-notes",
    imagen: cursoImage(curso.portada_public_id),
    imagenAlt: `Curso de ${curso.nombre} en GOSMEL Music Academy`,
    descripcion: curso.resumen ?? curso.descripcion,
    aprende: (curso.curso_habilidades ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((habilidad) => habilidad.habilidad)
      .slice(0, 3),
  }));

  if (rows.length > 0) {
    return { data: rows, error: null };
  }

  return { data: STATIC_FALLBACK, error: null };
}