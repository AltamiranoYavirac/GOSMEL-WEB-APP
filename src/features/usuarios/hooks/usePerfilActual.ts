"use client";

import { useQuery } from "@tanstack/react-query";

import { getPerfilActual } from "../api/getPerfilActual";
import { usuariosQueryKeys } from "../model/query-keys";

export function usePerfilActual() {
  return useQuery({
    queryKey: usuariosQueryKeys.perfilActual(),
    queryFn: async () => {
      const { data, error } = await getPerfilActual();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
