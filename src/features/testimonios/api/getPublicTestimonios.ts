import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicTestimonio } from "../model/testimonio.types";

export const getPublicTestimonios = cache(async (): Promise<{
  data: IPublicTestimonio[];
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("id, autor_nombre, autor_rol, cita, puntuacion, foto_public_id")
    .is("curso_id", null)
    .is("docente_id", null)
    .eq("publicado", true)
    .order("orden", { ascending: true })
    .limit(6);

  if (error) return { data: [], error: error.message };

  return {
    data: (data ?? []).map((item) => ({
      id: item.id,
      autor: item.autor_nombre,
      rol: item.autor_rol,
      cita: item.cita,
      puntuacion: item.puntuacion,
      fotoPublicId: item.foto_public_id,
    })),
    error: null,
  };
});
