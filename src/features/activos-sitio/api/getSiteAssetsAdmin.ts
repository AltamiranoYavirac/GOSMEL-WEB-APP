import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISiteAssetAdminRow } from "../model/site-asset-admin.types";

export async function getSiteAssetsAdmin(): Promise<{
  data: ISiteAssetAdminRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("activos_sitio")
    .select("clave, nombre, public_id, texto_alt, publicado, orden")
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };
  return {
    data: (data ?? []).map((item) => ({
      key: item.clave,
      name: item.nombre,
      publicId: item.public_id,
      alt: item.texto_alt ?? "",
      published: item.publicado,
      order: item.orden,
    })),
    error: null,
  };
}
