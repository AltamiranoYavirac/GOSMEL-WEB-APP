"use client";

import { useQuery } from "@tanstack/react-query";

import { getInscripcionesPendientes } from "../api/getInscripcionesPendientes";
import { catedrasQueryKeys } from "../model/query-keys";

export function useInscripcionesPendientes(catedraId: string, enabled = true) {
  return useQuery({
    queryKey: catedrasQueryKeys.inscripcionesPendientes(catedraId),
    queryFn: async () => {
      const { data, error } = await getInscripcionesPendientes(catedraId);
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled: enabled && !!catedraId,
  });
}