"use client";

import { useQuery } from "@tanstack/react-query";

import { getConfiguracion } from "../api/getConfiguracion";
import { configuracionQueryKeys } from "../model/query-keys";

export function useConfiguracion() {
  return useQuery({
    queryKey: configuracionQueryKeys.detail(),
    queryFn: async () => {
      const { data, error } = await getConfiguracion();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    retry: false,
  });
}