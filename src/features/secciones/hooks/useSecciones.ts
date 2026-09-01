"use client";

import { useQuery } from "@tanstack/react-query";

import { getSecciones } from "../api/getSecciones";
import { seccionesQueryKeys } from "../model/query-keys";

export function useSecciones() {
  return useQuery({
    queryKey: seccionesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getSecciones();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}