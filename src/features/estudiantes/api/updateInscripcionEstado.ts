import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function updateInscripcionEstado(
  inscripcionId: string,
  estado: "retirada" | "cancelada"
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("inscripciones")
    .update({ estado })
    .eq("id", inscripcionId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}