"use client";

import { useQuery } from "@tanstack/react-query";

import { getInscripcionesPendientes } from "../api/getInscripcionesPendientes";
import { matriculasQueryKeys } from "../model/query-keys";

export function useInscripcionesPendientes(catedraId?: string, enabled = true) {
  return useQuery({
    queryKey: matriculasQueryKeys.pendientes(catedraId),
    queryFn: async () => {
      const { data, error } = await getInscripcionesPendientes(catedraId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    retry: false,
    enabled,
  });
}
