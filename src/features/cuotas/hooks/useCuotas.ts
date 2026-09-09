"use client";

import { useQuery } from "@tanstack/react-query";

import { getCuotas } from "../api/getCuotas";
import { cuotasQueryKeys } from "../model/query-keys";

export function useCuotas() {
  return useQuery({
    queryKey: cuotasQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getCuotas();
      if (error) throw new Error(error);
      return data ?? [];
    },
    retry: false,
  });
}