import { cache } from "react";

import { createSupabasePublicClient } from "@/shared/api/supabase/public";

import type { IPublicCourseReview } from "../model/course-public.types";

export const getPublicCourseReviews = cache(async (cursoId: string): Promise<{
  data: IPublicCourseReview[];
  error: string | null;
}> => {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("curso_resenas")
    .select("id, puntuacion, comentario, created_at")
    .eq("curso_id", cursoId)
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) return { data: [], error: error.message };

  return {
    data: (data ?? []).map((item) => ({
      id: item.id,
      puntuacion: item.puntuacion,
      comentario: item.comentario,
      createdAt: item.created_at,
    })),
    error: null,
  };
});
