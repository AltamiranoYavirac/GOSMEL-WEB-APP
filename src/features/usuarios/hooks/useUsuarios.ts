"use client";

import { useQuery } from "@tanstack/react-query";

import { getUsuarios } from "../api/getUsuarios";
import { usuariosQueryKeys } from "../model/query-keys";

export function useUsuarios() {
  return useQuery({
    queryKey: usuariosQueryKeys.list(),
    queryFn: async () => {
      const { data, error } = await getUsuarios();
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });
}