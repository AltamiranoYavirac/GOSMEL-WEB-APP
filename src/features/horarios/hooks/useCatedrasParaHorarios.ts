"use client";

import { useQuery } from "@tanstack/react-query";

import { getCatedrasParaHorarios } from "../api/getCatedrasParaHorarios";
import { horariosQueryKeys } from "../model/query-keys";

export function useCatedrasParaHorarios(enabled = true) {
  return useQuery({
    queryKey: [...horariosQueryKeys.all, "catedras-options"],
    queryFn: async () => {
      const { data, error } = await getCatedrasParaHorarios();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 60_000,
    enabled,
  });
}
