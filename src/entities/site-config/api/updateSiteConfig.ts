import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ISiteConfigUpdate } from "../model/site-config.types";

export async function updateSiteConfig(
  values: ISiteConfigUpdate,
): Promise<{ data: { updated: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .upsert(
      {
        id: 1,
        ciudad: values.ciudad,
        direccion: values.direccion,
        telefono: values.telefono,
        whatsapp: values.whatsapp,
        email_general: values.emailGeneral,
        email_admisiones: values.emailAdmisiones,
        horario_atencion: values.horarioAtencion,
        mapa_embed: values.mapaEmbed,
        redes_sociales: values.redesSociales,
      },
      { onConflict: "id" },
    )
    .select("updated_at")
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "No se pudo guardar la configuración." };
  }

  return { data: { updated: data.updated_at }, error: null };
}
