"use client";

import { useQuery } from "@tanstack/react-query";

import { getCuotasParaCierre } from "../api/getCuotasParaCierre";
import { acuerdosQueryKeys } from "../model/query-keys";

export function useCuotasParaCierre(acuerdoId: string, enabled: boolean) {
  return useQuery({
    queryKey: acuerdosQueryKeys.cuotasParaCierre(acuerdoId),
    queryFn: async () => {
      const { data, error } = await getCuotasParaCierre(acuerdoId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    enabled: enabled && Boolean(acuerdoId),
    retry: false,
  });
}
