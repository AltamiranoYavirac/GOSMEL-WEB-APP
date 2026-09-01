import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TEstadoSesion } from "../model/horario.types";

export async function updateSesionEstado(
  sesionId: string,
  estado: TEstadoSesion
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("sesiones")
    .update({ estado })
    .eq("id", sesionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function eliminarSesion(
  sesionId: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("sesiones").delete().eq("id", sesionId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
