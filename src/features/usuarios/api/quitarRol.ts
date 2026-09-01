import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { TRolUsuario } from "../model/usuario.types";

export async function quitarRol(
  perfilId: string,
  rol: TRolUsuario
): Promise<{ data: { perfilId: string } | null; error: string | null }> {
  if (rol === "admin") {
    return { data: null, error: "No se puede quitar el rol de administrador" };
  }

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("perfil_rol")
    .delete()
    .eq("perfil_id", perfilId)
    .eq("rol", rol);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { perfilId }, error: null };
}