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

export async function crearInstrumento(
  values: IInstrumentoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const baseSlug = slugify(values.nombre) || "instrumento";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

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
