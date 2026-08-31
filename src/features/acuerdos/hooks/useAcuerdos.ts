"use client";

import { useQuery } from "@tanstack/react-query";

import { getAcuerdos } from "../api/getAcuerdos";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useAcuerdos() {
  return useQuery({
    queryKey: acuerdosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getAcuerdos();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}