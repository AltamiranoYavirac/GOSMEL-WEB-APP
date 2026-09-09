"use client";

import { useQuery } from "@tanstack/react-query";

import { getInstrumentoOptions } from "../api/getInstrumentoOptions";
import { instrumentQueryKeys } from "../model/query-keys";

export function useInstrumentoOptions(enabled = true) {
  return useQuery({
    queryKey: instrumentQueryKeys.options(),
    queryFn: async () => {
      const { data, error } = await getInstrumentoOptions();
      if (error) throw new Error(error);
      return data ?? [];
    },
    retry: false,
    enabled,
  });
}
