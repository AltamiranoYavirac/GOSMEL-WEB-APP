import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildGaleriaUpdatePayload, type IGaleriaFormValues } from "../model/GaleriaForm.config";

export async function updateGaleriaMedio(
  id: string,
  values: IGaleriaFormValues,
  publicId: string | null
): Promise<{ data: { id: string } | null; error: string | null }> {
  if (!publicId) return { data: null, error: "Selecciona una imagen." };

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("galeria_medios")
    .update(buildGaleriaUpdatePayload(values, publicId))
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error || !data) return { data: null, error: error?.message ?? "No se pudo actualizar el medio." };
  return { data, error: null };
}
