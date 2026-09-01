"use client";

import { useQuery } from "@tanstack/react-query";

import { getSesiones } from "../api/getSesiones";
import { horariosQueryKeys } from "../model/query-keys";

export function useSesiones() {
  return useQuery({
    queryKey: horariosQueryKeys.sesiones(),
    queryFn: async () => {
      const { data, error } = await getSesiones();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}