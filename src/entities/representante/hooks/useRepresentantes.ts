"use client";

import { useQuery } from "@tanstack/react-query";

import { getRepresentantes } from "../api/getRepresentantes";
import { representantesQueryKeys } from "../model/query-keys";

export function useRepresentantes() {
  return useQuery({
    queryKey: representantesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getRepresentantes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}