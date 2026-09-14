import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { buildGaleriaInsertPayload, type IGaleriaFormValues } from "../model/GaleriaForm.config";

export async function crearGaleriaMedio(
  values: IGaleriaFormValues,
  publicId: string | null
): Promise<{ data: { id: string } | null; error: string | null }> {
  if (!publicId) return { data: null, error: "Selecciona una imagen." };

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("galeria_medios")
    .insert(buildGaleriaInsertPayload(values, publicId))
    .select("id")
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
