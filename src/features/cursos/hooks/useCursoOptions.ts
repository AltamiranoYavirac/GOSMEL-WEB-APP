"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursoOptions } from "../api/getCursoOptions";
import { cursosQueryKeys } from "../model/query-keys";

export function useCursoOptions(enabled = true) {
  return useQuery({
    queryKey: [...cursosQueryKeys.all, "options"],
    queryFn: async () => {
      const { data, error } = await getCursoOptions();
      if (error) throw new Error(error);
      return data ?? { instrumentos: [], docentes: [] };
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}