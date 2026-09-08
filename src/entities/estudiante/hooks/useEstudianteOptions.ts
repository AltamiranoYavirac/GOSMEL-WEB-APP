"use client";

import { useQuery } from "@tanstack/react-query";

import { getEstudianteOptions } from "../api/getEstudianteOptions";
import { estudianteQueryKeys } from "../model/query-keys";

export function useEstudianteOptions(enabled = true) {
  return useQuery({
    queryKey: estudianteQueryKeys.options(),
    queryFn: async () => {
      const { data, error } = await getEstudianteOptions();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}
