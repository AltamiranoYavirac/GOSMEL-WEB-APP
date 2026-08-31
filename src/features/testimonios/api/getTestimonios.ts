import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITestimonioRow } from "../model/testimonio.types";

export async function getTestimonios(): Promise<{
  data: ITestimonioRow[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("id, autor_nombre, autor_rol, cita, puntuacion, publicado")
    .order("orden", { ascending: true })
    .limit(200);

  if (error) {
    return { data: null, error: error.message };
  }

  const rows: ITestimonioRow[] = (data ?? []).map((testimonio) => ({
    id: testimonio.id,
    autor: testimonio.autor_nombre,
    rol: testimonio.autor_rol,
    cita: testimonio.cita,
    puntuacion: testimonio.puntuacion,
    publicado: testimonio.publicado,
  }));

  return { data: rows, error: null };
}