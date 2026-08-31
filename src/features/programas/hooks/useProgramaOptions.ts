"use client";

import { useQuery } from "@tanstack/react-query";

import { getProgramaOptions } from "../api/getProgramaOptions";
import { programasQueryKeys } from "../model/query-keys";

export function useProgramaOptions(enabled = true) {
  return useQuery({
    queryKey: [...programasQueryKeys.all, "options"],
    queryFn: async () => {
      const { data, error } = await getProgramaOptions();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
