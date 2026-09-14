import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IInstrumentoFormValues } from "../model/InstrumentoForm.config";

function slugify(text: string): string {
  return text
    .toString()
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
    const { data } = await supabase.from("instrumentos").select("slug").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    intento += 1;
    slug = `${base}-${intento}`;
  }
}

export async function crearInstrumento(
  values: IInstrumentoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const baseSlug = slugify(values.nombre) || "instrumento";
  const slug = await generarSlugUnico(supabase, baseSlug);

  const { data, error } = await supabase
    .from("instrumentos")
    .insert({
      nombre: values.nombre.trim(),
      slug,
      tipo_instrumento_id: values.tipoInstrumentoId,
      icono: values.icono?.trim() || null,
      orden: values.orden,
      activo: values.activo,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateInstrumento(
  instrumentoId: string,
  values: IInstrumentoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("instrumentos")
    .update({
      nombre: values.nombre.trim(),
      tipo_instrumento_id: values.tipoInstrumentoId,
      icono: values.icono?.trim() || null,
      orden: values.orden,
      activo: values.activo,
    })
    .eq("id", instrumentoId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function eliminarInstrumento(
  instrumentoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("instrumentos").delete().eq("id", instrumentoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
