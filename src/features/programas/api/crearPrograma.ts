import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IProgramaFormValues } from "../model/ProgramaForm.config";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function crearPrograma(
  values: IProgramaFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const baseSlug = slugify(values.nombre) || "programa";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("programas")
    .insert({
      nombre: values.nombre.trim(),
      slug,
      descripcion: values.descripcion?.trim() || null,
      objetivos: values.objetivos?.trim() || null,
      instrumento_id: values.instrumentoId || null,
      nivel: values.nivel || null,
      publicado: values.publicado,
      orden: values.orden,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
