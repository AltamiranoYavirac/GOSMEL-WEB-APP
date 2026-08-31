"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedrasParaMatricula } from "../api/getCatedrasParaMatricula";
import { solicitudesQueryKeys } from "../model/query-keys";

export function useCatedrasParaMatricula(enabled = true) {
  return useQuery({
    queryKey: [...solicitudesQueryKeys.all, "catedras-matricula"],
    queryFn: async () => {
      const { data, error } = await getCatedrasParaMatricula();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}