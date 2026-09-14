import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildSiteAssetPayload, type ISiteAssetFormValues } from "../model/SiteAssetForm.config";

export async function updateSiteAsset(
  key: string,
  values: ISiteAssetFormValues,
  publicId: string | null
): Promise<{ data: { key: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("activos_sitio")
    .update(buildSiteAssetPayload(values, publicId))
    .eq("clave", key)
    .select("clave")
    .maybeSingle();

  if (error || !data) return { data: null, error: error?.message ?? "No se pudo guardar la imagen." };
  return { data: { key: data.clave }, error: null };
}
