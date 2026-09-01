"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedrasOptions } from "../api/getCatedrasOptions";
import { evaluacionesQueryKeys } from "../model/query-keys";

export function useCatedrasOptions(enabled = true) {
  return useQuery({
    queryKey: [...evaluacionesQueryKeys.all, "catedras-options"],
    queryFn: async () => {
      const { data, error } = await getCatedrasOptions();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    enabled,
  });
}
