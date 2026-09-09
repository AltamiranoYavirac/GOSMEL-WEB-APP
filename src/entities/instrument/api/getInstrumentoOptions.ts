import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IInstrumentoOption } from "../model/instrument.types";

export async function getInstrumentoOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IInstrumentoOption[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("instrumentos")
    .select("id, nombre")
    .eq("activo", true)
    .order("nombre", { ascending: true })
    .limit(300);

  if (error) {
    return { data: null, error: error.message };
  }

  const options: IInstrumentoOption[] = (data ?? []).map((instrumento) => ({
    id: instrumento.id,
    nombre: instrumento.nombre,
  }));

  return { data: options, error: null };
}
