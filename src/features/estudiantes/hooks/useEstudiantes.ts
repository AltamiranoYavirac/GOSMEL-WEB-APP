"use client";

import { useQuery } from "@tanstack/react-query";

import { getEstudiantes } from "../api/getEstudiantes";
import { estudiantesQueryKeys } from "../model/query-keys";

export function useEstudiantes() {
  return useQuery({
    queryKey: estudiantesQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getEstudiantes();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}