import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/api/supabase/database.types";

import type { IEstudianteOption } from "../model/estudiante-option.types";

export async function getEstudianteOptions(
  supabase: SupabaseClient<Database> = createSupabaseBrowserClient(),
): Promise<{
  data: IEstudianteOption[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("estudiantes")
    .select("id, nombres, apellidos")
    .eq("activo", true)
    .order("nombres", { ascending: true })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const options: IEstudianteOption[] = (data ?? []).map((estudiante) => ({
    value: estudiante.id,
    label: `${estudiante.nombres} ${estudiante.apellidos}`.trim(),
  }));

  return { data: options, error: null };
}
