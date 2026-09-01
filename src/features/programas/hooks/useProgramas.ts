"use client";

import { useQuery } from "@tanstack/react-query";

import { getProgramas } from "../api/getProgramas";
import { programasQueryKeys } from "../model/query-keys";

export function useProgramas() {
  return useQuery({
    queryKey: programasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getProgramas();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}