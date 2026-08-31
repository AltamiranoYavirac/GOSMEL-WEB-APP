import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITipoInstrumentoRow } from "../model/instrumento.types";
import type { ITipoInstrumentoFormValues } from "../model/TipoInstrumentoForm.config";

export async function getTiposInstrumento(): Promise<{
  data: ITipoInstrumentoRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tipos_instrumento")
    .select("id, nombre, orden, activo")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ITipoInstrumentoRow[] = (data ?? []).map((t) => ({
    id: t.id,
    nombre: t.nombre,
    orden: t.orden,
    activo: t.activo,
  }));

  return { data: rows, error: null };
}

export async function crearTipoInstrumento(
  values: ITipoInstrumentoFormValues
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tipos_instrumento")
    .insert({
      nombre: values.nombre.trim(),
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

export async function eliminarTipoInstrumento(
  tipoId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("tipos_instrumento").delete().eq("id", tipoId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
