import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { ISiteAsset, TSiteAssetMap } from "../model/site-asset.types";

export const getPublicSiteAssets = cache(async (): Promise<{
  data: TSiteAssetMap | null;
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("activos_sitio")
    .select("clave, nombre, public_id, texto_alt, orden")
    .eq("publicado", true)
    .not("public_id", "is", null)
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };

  const assets = (data ?? []).reduce<TSiteAssetMap>((result, item) => {
    if (!item.public_id) return result;
    const asset: ISiteAsset = {
      key: item.clave,
      name: item.nombre,
      publicId: item.public_id,
      alt: item.texto_alt ?? "",
      order: item.orden,
    };
    result[item.clave] = asset;
    return result;
  }, {});

  return { data: assets, error: null };
});
