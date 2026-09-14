import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import {
  buildProgramaInsertPayload,
  type IProgramaFormValues,
} from "../model/ProgramaForm.config";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
    const { data } = await supabase.from("programas").select("slug").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    intento += 1;
    slug = `${base}-${intento}`;
  }
}

export async function crearPrograma(
  values: IProgramaFormValues,
  imagenPublicId: string | null = null
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const baseSlug = slugify(values.nombre) || "programa";
  const slug = await generarSlugUnico(supabase, baseSlug);
  const { data, error } = await supabase
    .from("programas")
    .insert(buildProgramaInsertPayload(values, slug, imagenPublicId))
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
