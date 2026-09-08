import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IInstrumentoOption } from "../model/instrument.types";

export async function getInstrumentoOptions(): Promise<{
  data: IInstrumentoOption[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
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
