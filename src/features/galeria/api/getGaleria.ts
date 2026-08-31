import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IGaleriaMedioRow, TCategoriaMedio } from "../model/galeria.types";

export async function getGaleria(): Promise<{
  data: IGaleriaMedioRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("galeria_medios")
    .select("id, titulo, texto_alt, categoria, public_id, publicado")
    .order("orden", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IGaleriaMedioRow[] = (data ?? []).map((medio) => ({
    id: medio.id,
    titulo: medio.titulo,
    textoAlt: medio.texto_alt,
    categoria: medio.categoria as TCategoriaMedio,
    publicId: medio.public_id,
    publicado: medio.publicado,
  }));

  return { data: rows, error: null };
}