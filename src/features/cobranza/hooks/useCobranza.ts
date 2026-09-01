"use client";

import { useQuery } from "@tanstack/react-query";

import { getCobranza } from "../api/getCobranza";
import { cobranzaQueryKeys } from "../model/query-keys";

export function useCobranza() {
  return useQuery({
    queryKey: cobranzaQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCobranza();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}