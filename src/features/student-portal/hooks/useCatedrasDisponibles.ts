"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedrasDisponibles } from "../api/getCatedrasDisponibles";
import { studentQueryKeys } from "../model/query-keys";

export function useCatedrasDisponibles(enabled = true) {
  return useQuery({
    queryKey: studentQueryKeys.catedrasDisponibles(),
    queryFn: async () => {
      const { data, error } = await getCatedrasDisponibles();
      if (error) throw new Error(error ?? "No se pudieron cargar las cátedras disponibles");
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}