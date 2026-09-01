"use client";

import { useQuery } from "@tanstack/react-query";

import { getMetricas } from "../api/getMetricas";
import { metricasQueryKeys } from "../model/query-keys";

export function useMetricas() {
  return useQuery({
    queryKey: metricasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getMetricas();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}