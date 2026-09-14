"use client";

import { useQuery } from "@tanstack/react-query";

import { getGaleriaOptions } from "../api/getGaleriaOptions";
import { galeriaQueryKeys } from "../model/query-keys";

export function useGaleriaOptions(enabled: boolean) {
  return useQuery({
    queryKey: galeriaQueryKeys.options(),
    queryFn: async () => {
      const { data, error } = await getGaleriaOptions();
      if (error) throw new Error(error);
      return data ?? [];
    },
    enabled,
  });
}
