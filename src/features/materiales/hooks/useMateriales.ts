"use client";

import { useQuery } from "@tanstack/react-query";

import { getMateriales } from "../api/getMateriales";
import { materialesQueryKeys } from "../model/query-keys";

export function useMateriales() {
  return useQuery({
    queryKey: materialesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getMateriales();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}