import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function toggleFavorite(cursoId: string): Promise<{
  data: { favorito: boolean } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "No autenticado" };
  }

  const { data: existente } = await supabase
    .from("favoritos")
    .select("curso_id")
    .eq("perfil_id", user.id)
    .eq("curso_id", cursoId)
    .maybeSingle();

  if (existente) {
    const { error } = await supabase.from("favoritos").delete().eq("perfil_id", user.id).eq("curso_id", cursoId);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: { favorito: false }, error: null };
  }

  const { error } = await supabase.from("favoritos").insert({ perfil_id: user.id, curso_id: cursoId });
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: { favorito: true }, error: null };
}