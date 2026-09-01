"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursoGuia } from "../api/getCursoGuia";
import { cursosQueryKeys } from "../model/query-keys";

export function useCursoGuia(cursoId: string, enabled = true) {
  return useQuery({
    queryKey: [...cursosQueryKeys.all, "guia", cursoId],
    queryFn: async () => {
      const { data, error } = await getCursoGuia(cursoId);
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: enabled && !!cursoId,
  });
}