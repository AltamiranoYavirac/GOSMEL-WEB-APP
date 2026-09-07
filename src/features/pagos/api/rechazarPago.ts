import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function rechazarPago(
  pagoId: string,
  observacion: string
): Promise<{ data: { id: string } | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("pagos")
    .update({
      estado: "rechazado",
      observacion: observacion.trim() || null,
    })
    .eq("id", pagoId)
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
