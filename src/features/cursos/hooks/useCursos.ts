"use client";

import { useQuery } from "@tanstack/react-query";

import { getCursos } from "../api/getCursos";
import { cursosQueryKeys } from "../model/query-keys";

export function useCursos() {
  return useQuery({
    queryKey: cursosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCursos();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}