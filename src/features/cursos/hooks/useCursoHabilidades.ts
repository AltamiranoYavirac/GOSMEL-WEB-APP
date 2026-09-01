"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursoHabilidades } from "../api/getCursoHabilidades";
import { cursosQueryKeys } from "../model/query-keys";

export function useCursoHabilidades(cursoId: string, enabled = true) {
  return useQuery({
    queryKey: [...cursosQueryKeys.all, "habilidades", cursoId],
    queryFn: async () => {
      const { data, error } = await getCursoHabilidades(cursoId);
      if (error) throw new Error(error);
      return data;
    },
    enabled: enabled && !!cursoId,
  });
}
