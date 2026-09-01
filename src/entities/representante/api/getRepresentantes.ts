import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { IRepresentanteRow } from "../model/representante.types";

export async function getRepresentantes(): Promise<{
  data: IRepresentanteRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("representantes")
    .select("id, nombres, apellidos, cedula, celular, email, direccion, ocupacion, perfil_id, estudiante_representante(estudiante_id)")
    .order("apellidos", { ascending: true })
    .limit(500);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: IRepresentanteRow[] = (data ?? []).map((representante) => ({
    id: representante.id,
    nombres: representante.nombres,
    apellidos: representante.apellidos,
    nombre: `${representante.nombres ?? ""} ${representante.apellidos ?? ""}`.trim(),
    cedula: representante.cedula,
    celular: representante.celular,
    email: representante.email,
    direccion: representante.direccion,
    ocupacion: representante.ocupacion,
    perfil_id: representante.perfil_id,
    hijos: representante.estudiante_representante?.length ?? 0,
  }));

  return { data: rows, error: null };
}