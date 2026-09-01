"use client";

import { useQuery } from "@tanstack/react-query";

import { getCalificacionesEvaluacion } from "../api/getCalificacionesEvaluacion";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useCalificacionesEvaluacion(evaluacionId: string, enabled = true) {
  return useQuery({
    queryKey: [...evaluacionesQueryKeys.all, "calificaciones", evaluacionId],
    queryFn: async () => {
      const { data, error } = await getCalificacionesEvaluacion(evaluacionId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: enabled && !!evaluacionId,
  });
}
