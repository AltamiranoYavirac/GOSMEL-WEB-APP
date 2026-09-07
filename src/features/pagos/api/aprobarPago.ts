import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function aprobarPago(
  pagoId: string
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("pagos")
    .update({ estado: "aprobado" })
    .eq("id", pagoId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
