"use client";

import { useQuery } from "@tanstack/react-query";

import { getPagos } from "../api/getPagos";
import { pagosQueryKeys } from "../model/query-keys";

export function usePagos() {
  return useQuery({
    queryKey: pagosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getPagos();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}