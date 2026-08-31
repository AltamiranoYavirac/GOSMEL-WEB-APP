"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedras } from "../api/getCatedras";
import { catedrasQueryKeys } from "../model/query-keys";

export function useCatedras() {
  return useQuery({
    queryKey: catedrasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCatedras();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}