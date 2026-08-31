import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IUsuarioRow, TRolUsuario } from "../model/usuario.types";

export async function getUsuarios(): Promise<{
  data: IUsuarioRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("perfiles")
    .select("id, nombres, apellidos, email, cedula, celular, activo, perfil_rol!perfil_rol_perfil_id_fkey(rol)")
    .order("apellidos", { ascending: true })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IUsuarioRow[] = (data ?? []).map((perfil) => ({
    id: perfil.id,
    nombre: `${perfil.nombres} ${perfil.apellidos}`.trim(),
    email: perfil.email,
    cedula: perfil.cedula,
    celular: perfil.celular,
    roles: (perfil.perfil_rol ?? []).map((item) => item.rol as TRolUsuario),
    activo: perfil.activo,
  }));

  return { data: rows, error: null };
}