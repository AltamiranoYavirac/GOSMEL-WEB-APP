"use client";

import { useQuery } from "@tanstack/react-query";

import { getGaleria } from "../api/getGaleria";
import { galeriaQueryKeys } from "../model/query-keys";

export function useGaleria() {
  return useQuery({
    queryKey: galeriaQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getGaleria();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}