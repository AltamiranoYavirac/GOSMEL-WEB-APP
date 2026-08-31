"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedraOptions } from "../api/getCatedraOptions";
import { catedrasQueryKeys } from "../model/query-keys";

export function useCatedraOptions(enabled = true) {
  return useQuery({
    queryKey: [...catedrasQueryKeys.all, "options"],
    queryFn: async () => {
      const { data, error } = await getCatedraOptions();
      if (error) throw new Error(error);
      return data ?? { cursos: [], docentes: [] };
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}