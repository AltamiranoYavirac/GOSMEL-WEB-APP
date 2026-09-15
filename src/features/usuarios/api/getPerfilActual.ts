import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function getPerfilActual(): Promise<{
  data: { id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: user ? { id: user.id } : null, error: null };
}
