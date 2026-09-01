"use client";

import { useQuery } from "@tanstack/react-query";

import { getEstudianteDetalle } from "../api/getEstudianteDetalle";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useEstudianteDetalle(estudianteId: string, enabled = true) {
  return useQuery({
    queryKey: [...estudiantesQueryKeys.all, "detalle", estudianteId],
    queryFn: async () => {
      const { data, error } = await getEstudianteDetalle(estudianteId);
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    retry: false,
    enabled: enabled && !!estudianteId,
  });
}