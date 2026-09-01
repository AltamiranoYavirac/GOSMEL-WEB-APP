import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IConfiguracionSitio } from "../model/configuracion.types";

export async function getConfiguracion(): Promise<{
  data: IConfiguracionSitio | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select("ciudad, direccion, telefono, whatsapp, email_general, email_admisiones, horario_atencion, mapa_embed, redes_sociales, updated_at")
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return {
    data: {
      ciudad: data.ciudad,
      direccion: data.direccion,
      telefono: data.telefono,
      whatsapp: data.whatsapp,
      emailGeneral: data.email_general,
      emailAdmisiones: data.email_admisiones,
      horarioAtencion: data.horario_atencion,
      mapaEmbed: data.mapa_embed,
      redesSociales: data.redes_sociales,
      actualizado: data.updated_at,
    },
    error: null,
  };
}