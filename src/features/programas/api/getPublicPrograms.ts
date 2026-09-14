import { createSupabasePublicClient } from "@/shared/api/supabase/public";
import { buildCloudinaryImageUrl } from "@/shared/lib";

import { resolveProgramaInstrumento } from "../model/programa-instrumento";
import type { IPublicProgram } from "../model/program-public.types";

export const PUBLIC_PROGRAM_SELECT =
  "id, slug, nombre, descripcion, nivel, imagen_public_id, imagen_texto_alt, etiqueta_precio, mostrar_precio, orden, programa_curso(orden, cursos(id, slug, nombre, instrumentos(nombre, tipos_instrumento(nombre)))), programa_objetivos(objetivo, orden)";

interface IPublicProgramRow {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  nivel: string | null;
  imagen_public_id: string | null;
  imagen_texto_alt: string | null;
  etiqueta_precio: string | null;
  mostrar_precio: boolean;
  programa_curso: Array<{
    orden: number;
    cursos: {
      id: string;
      slug: string;
      nombre: string;
      instrumentos: { nombre: string; tipos_instrumento: { nombre: string } | null } | null;
    } | null;
  }> | null;
  programa_objetivos: Array<{ objetivo: string; orden: number }> | null;
}

export function mapPublicProgram(program: IPublicProgramRow): IPublicProgram {
  return {
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
  };
}

export async function getPublicPrograms(): Promise<{
  data: IPublicProgram[] | null;
  error: string | null;
}> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("programas")
    .select(PUBLIC_PROGRAM_SELECT)
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };

  return {
    data: (data ?? []).map((program) => mapPublicProgram(program as unknown as IPublicProgramRow)),
    error: null,
  };
}
