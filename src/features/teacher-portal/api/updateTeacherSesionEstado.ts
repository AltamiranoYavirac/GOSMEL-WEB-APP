import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TEstadoSesion } from "../model/teacher-dashboard.types";

export async function updateTeacherSesionEstado(
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
