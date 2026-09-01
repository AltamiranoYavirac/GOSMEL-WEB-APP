"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvaluaciones } from "../api/getEvaluaciones";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useEvaluaciones() {
  return useQuery({
    queryKey: evaluacionesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getEvaluaciones();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}