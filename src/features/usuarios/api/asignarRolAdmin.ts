import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function asignarRolAdmin(
  perfilId: string,
): Promise<{ data: { perfilId: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("perfil_rol")
    .upsert(
      { perfil_id: perfilId, rol: "admin", asignado_por: user?.id ?? null },
      { onConflict: "perfil_id,rol", ignoreDuplicates: true },
    );

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { perfilId }, error: null };
}
