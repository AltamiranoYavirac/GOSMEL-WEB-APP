"use client";

import { useQuery } from "@tanstack/react-query";

import { getPerfilesDisponibles } from "../api/getPerfilesDisponibles";
import { docentesQueryKeys } from "../model/query-keys";

export function usePerfilesDisponibles(enabled = true) {
  return useQuery({
    queryKey: [...docentesQueryKeys.all, "perfiles-disponibles"],
    queryFn: async () => {
      const { data, error } = await getPerfilesDisponibles();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}
