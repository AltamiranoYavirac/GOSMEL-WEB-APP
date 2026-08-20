"use client";

import { useQuery } from "@tanstack/react-query";

import { topbarQueryKeys } from "../model/topbar.query-keys";
import { getTopbarSummary } from "../api";

export function useTopbarSummary() {
  return useQuery({
    queryKey: topbarQueryKeys.summary(),
    queryFn: async () => {
      const { data, error } = await getTopbarSummary();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: false,
  });
}
