import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export async function generarCuotasMes(
  mes: string
): Promise<{ data: number | null; error: string | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("generar_cuotas_mes", { p_mes: mes });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}