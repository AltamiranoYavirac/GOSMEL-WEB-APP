"use client";

import { useQuery } from "@tanstack/react-query";

import { getDocenteDetalle } from "../api/getDocenteDetalle";
import { docentesQueryKeys } from "../model/query-keys";

export function useDocenteDetalle(docenteId: string, enabled = true) {
  return useQuery({
    queryKey: [...docentesQueryKeys.all, "detalle", docenteId],
    queryFn: async () => {
      const { data, error } = await getDocenteDetalle(docenteId);
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: enabled && !!docenteId,
  });
}