import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { Json } from "@/shared/api/supabase/database.types";

import {
  buildCrearCursoPayload,
  type ICrearCursoFormValues,
} from "../model/CrearCursoForm.config";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generarSlugUnico(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  base: string
): Promise<string> {
  let slug = base;
  let intento = 1;

  while (true) {
    const { data } = await supabase.from("cursos").select("slug").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    intento += 1;
    slug = `${base}-${intento}`;
  }
}

export async function crearCurso(
  values: ICrearCursoFormValues,
  portadaPublicId: string | null = null
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const base = slugify(values.nombre) || "curso";
  const slug = await generarSlugUnico(supabase, base);
  const curso = buildCrearCursoPayload(values, slug, portadaPublicId);

  const { data, error } = await supabase.rpc("crear_curso_con_catedra", {
    p_curso: curso as unknown as Json,
    p_catedra: null,
  });

  if (error || !data) {
    return { data: null, error: error?.message ?? "No se pudo crear el curso." };
  }

  return { data: { id: data }, error: null };
}
