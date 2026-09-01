import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { ICreateRepresentanteInput } from "../model/representante.types";

export async function createRepresentante(input: ICreateRepresentanteInput): Promise<{
  data: { id: string } | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("representantes")
    .insert({
      nombres: input.nombres.trim(),
      apellidos: input.apellidos.trim(),
      celular: input.celular.trim(),
      email: input.email?.trim() || null,
      cedula: input.cedula?.trim() || null,
      direccion: input.direccion?.trim() || null,
      ocupacion: input.ocupacion?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
