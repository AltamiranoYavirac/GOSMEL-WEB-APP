import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IRepresentanteRow } from "../model/representante.types";

export async function getRepresentantes(): Promise<{
  data: IRepresentanteRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("representantes")
    .select("id, nombres, apellidos, cedula, celular, email, ocupacion, estudiante_representante(estudiante_id)")
    .order("apellidos", { ascending: true })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IRepresentanteRow[] = (data ?? []).map((representante) => ({
    id: representante.id,
    nombre: `${representante.nombres ?? ""} ${representante.apellidos ?? ""}`.trim(),
    cedula: representante.cedula,
    celular: representante.celular,
    email: representante.email,
    ocupacion: representante.ocupacion,
    hijos: representante.estudiante_representante?.length ?? 0,
  }));

  return { data: rows, error: null };
}