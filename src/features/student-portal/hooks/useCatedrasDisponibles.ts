"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedrasDisponibles } from "../api/getCatedrasDisponibles";
import { studentQueryKeys } from "../model/query-keys";

export function useCatedrasDisponibles(estudianteId?: string | null, enabled = true) {
  return useQuery({
    queryKey: studentQueryKeys.catedrasDisponibles(estudianteId),
    queryFn: async () => {
      const { data, error } = await getCatedrasDisponibles(estudianteId);
      if (error) throw new Error(error ?? "No se pudieron cargar las cátedras disponibles");
      return data ?? [];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    retry: false,
    enabled,
  });
}