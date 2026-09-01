"use client";

import { useQuery } from "@tanstack/react-query";

import { getMaterialOptions } from "../api/getMaterialOptions";
import { materialesQueryKeys } from "../model/query-keys";

export function useMaterialOptions(enabled = true) {
  return useQuery({
    queryKey: [...materialesQueryKeys.all, "options"],
    queryFn: async () => {
      const { data, error } = await getMaterialOptions();
      if (error) throw new Error(error);
      return data ?? { cursos: [], catedras: [] };
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}