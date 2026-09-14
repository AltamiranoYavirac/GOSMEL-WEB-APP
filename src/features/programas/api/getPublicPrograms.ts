import { createSupabasePublicClient } from "@/shared/api/supabase/public";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import { resolveProgramaInstrumento } from "../model/programa-instrumento";
import type { IPublicProgram } from "../model/program-public.types";

export async function getPublicPrograms(): Promise<{
  data: IPublicProgram[] | null;
  error: string | null;
}> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("programas")
    .select("id, slug, nombre, descripcion, nivel, imagen_public_id, imagen_texto_alt, etiqueta_precio, mostrar_precio, orden, programa_curso(orden, cursos(id, slug, nombre, instrumentos(nombre, tipos_instrumento(nombre)))), programa_objetivos(objetivo, orden)")
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };

  return {
    data: (data ?? []).map((program): IPublicProgram => ({
      id: program.id,
      slug: program.slug,
      title: program.nombre,
      description: program.descripcion ?? "",
      objectives: (program.programa_objetivos ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((item) => item.objetivo),
      level: program.nivel,
      priceLabel: program.mostrar_precio ? program.etiqueta_precio : null,
      instrument: resolveProgramaInstrumento(
        (program.programa_curso ?? []).map((vinculo) => ({
          instrumento: vinculo.cursos?.instrumentos?.nombre ?? null,
          familia: vinculo.cursos?.instrumentos?.tipos_instrumento?.nombre ?? null,
        }))
      ),
      image: buildCloudinaryImageUrl(program.imagen_public_id, "ar_4:3,c_fill,g_auto,w_1400,q_auto,f_auto"),
      imageAlt: program.imagen_texto_alt ?? `Programa ${program.nombre}`,
      courses: (program.programa_curso ?? [])
        .slice()
        .sort((a, b) => a.orden - b.orden)
        .map((item) => item.cursos)
        .filter((course): course is NonNullable<typeof course> => Boolean(course))
        .map((course) => ({ id: course.id, slug: course.slug, name: course.nombre })),
    })),
    error: null,
  };
}
