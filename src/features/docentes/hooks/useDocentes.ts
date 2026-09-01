"use client";

import { useQuery } from "@tanstack/react-query";

import { getDocentes } from "../api/getDocentes";
import { docentesQueryKeys } from "../model/query-keys";

export function useDocentes() {
  return useQuery({
    queryKey: docentesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getDocentes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}