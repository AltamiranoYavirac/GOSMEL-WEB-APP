import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IInstrumentoRow } from "../model/instrumento.types";

export async function getInstrumentos(): Promise<{
  data: IInstrumentoRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("instrumentos")
    .select("id, nombre, slug, tipo_instrumento_id, icono, imagen_public_id, orden, activo, tipos_instrumento(nombre)")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IInstrumentoRow[] = (data ?? []).map((item) => ({
    id: item.id,
    nombre: item.nombre,
    slug: item.slug,
    tipoInstrumentoId: item.tipo_instrumento_id,
    tipo: item.tipos_instrumento?.nombre ?? "Sin familia",
    icono: item.icono,
    imagenPublicId: item.imagen_public_id,
    orden: item.orden,
    activo: item.activo,
  }));

  return { data: rows, error: null };
}
