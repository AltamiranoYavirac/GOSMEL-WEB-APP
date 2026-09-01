import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { IUpdateRepresentanteInput } from "../model/representante.types";

export async function updateRepresentante(input: IUpdateRepresentanteInput): Promise<{
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("representantes")
    .update({
      nombres: input.nombres.trim(),
      apellidos: input.apellidos.trim(),
      celular: input.celular.trim(),
      email: input.email?.trim() || null,
      cedula: input.cedula?.trim() || null,
      direccion: input.direccion?.trim() || null,
      ocupacion: input.ocupacion?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
