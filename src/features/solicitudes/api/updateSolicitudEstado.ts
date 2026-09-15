import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TSolicitudEstado } from "../model/solicitud.types";

export async function updateSolicitudEstado(
  id: string,
  estado: TSolicitudEstado
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No hay sesión activa" };
  }

  const { data, error } = await supabase
    .from("solicitudes")
    .update({ estado, atendida_por: user.id })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}